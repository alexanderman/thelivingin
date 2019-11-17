const { print } = require('../services/utils');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const USER_COLL = db.collection('users');
const REQUEST_COLL = db.collection('requests');
const CHAT_COLL = db.collection('chats');
const ROLES_COLL = db.collection('roles');
const SMS_LOGS_COLL = db.collection('sms_logs');
const SMS_TEMPLATES_COLL = db.collection('sms_templates');


/** names of DTOs firestore internal fields, prevent from saving/updating them */
const SYS_FIELDS = {
    _id:            { name: 'id', format: v => v },
    _createTime:    { name: 'createTime', format: v => v.toDate() },
    _updateTime:    { name: 'updateTime', format: v => v.toDate() },
    _readTime:      { name: 'readTime', format: v => v.toDate() },
};

function _snapShotToObject(snapshot) {
    if (!snapshot.exists) 
        return null;
    
    return Object.keys(SYS_FIELDS).reduce((obj, key) => {
        obj[key] = SYS_FIELDS[key].format(snapshot[SYS_FIELDS[key].name]);
        return obj;
    }, { ...snapshot.data() });
}

/** returns new object without SYS_FIELDS */
function _clearSysFields(data) {
    return Object.keys(SYS_FIELDS).reduce((acc, key) => {
        delete acc[key];
        return acc;
    }, { ...data });
}

function _createData(collection, id, data) {
    const modifiedData = _clearSysFields({ ...data, createdAt: Date.now() });
    return collection.doc(id).set(modifiedData);
}

function generateUserId() {
    return USER_COLL.doc().id;
}

function generateChatId() {
    return CHAT_COLL.doc().id;
}

function generateRequestId() {
    return REQUEST_COLL.doc().id;
}

function createUser(id, data) {
    return _createData(USER_COLL, id, data);
}

function addRequestToUser(id, requestId) {
    return USER_COLL.doc(id).update({
        requests: FieldValue.arrayUnion(requestId)
    });
}

function updateUser(id, fields) {
    const modifiedFields = _clearSysFields(fields);
    return USER_COLL.doc(id).update(modifiedFields);
}

function createRequest(id, data) {
    return _createData(REQUEST_COLL, id, data);
}

function createChat(id, data) {
    return _createData(CHAT_COLL, id, data);
}

function updateChat(id, fields) {
    const modifiedFields = _clearSysFields(fields);
    return CHAT_COLL.doc(id).update(modifiedFields);
}

function deleteChatMember(id, userId) {
    return CHAT_COLL.doc(id).update({ [`twilio.members.${userId}`]: FieldValue.delete() });
}

function getUserByEmail(email) {
    return USER_COLL.where('email', '==', email).get()
    .then(snapshot => {
        if (snapshot.empty) {
            return null;
        }
        // could be more than one user with this email, return first one
        const foundUsers = [];
        snapshot.forEach(doc => {
            foundUsers.push(_snapShotToObject(doc));
        });
        return foundUsers[0];
    });
}

function getUserById(userId) {
    return USER_COLL.doc(userId).get()
    .then(_snapShotToObject);
}

function getChatById(chatId) {
    return CHAT_COLL.doc(chatId).get()
    .then(_snapShotToObject);
}

function getRequestById(requestId) {
    return REQUEST_COLL.doc(requestId).get()
    .then(_snapShotToObject);
}

function getAdmins() {
    return ROLES_COLL.doc('admin').get().then(doc => {
        const data = _snapShotToObject(doc);
        if (data) {
            const userRefs = data.users.map(id => USER_COLL.doc(id));
            return db.getAll(...userRefs);
        }
        return { empty: true };
    })
    .then(snapshot => {
        if (snapshot.empty) {
            return null;
        }
        const foundRecords = [];
        snapshot.forEach(doc => {
            foundRecords.push(_snapShotToObject(doc));
        });
        return foundRecords;
    })
}

function _debugFetch(collection, itemId) {
    if (!itemId) {
        return db.collection(collection).get()
        .then(snapshot => {
            const items = [];
            snapshot.forEach(doc => items.push(_snapShotToObject(doc)));
            return items;
        });
    }

    return db.collection(collection).doc(itemId).get()
    .then(_snapShotToObject);
}

function queryCollection(collection, filter, orderBy) {
    /** https://cloud.google.com/firestore/docs/query-data/queries */
    orderBy = orderBy || { key: 'createdAt', order: 'desc' };
    filter = filter || [];
    let query = collection;
    filter.forEach(item => {
        const { key, operator, operand } = item;
        query = !query
            ? collection.where(key, operator, operand)
            : query.where(key, operator, operand);
    });
    return query.orderBy(orderBy.key, orderBy.order).get()
        .then(snapshot => {
            if (snapshot.empty) {
                return null;
            }
            const foundRecords = [];
            snapshot.forEach(doc => {
                foundRecords.push(_snapShotToObject(doc));
            });
            return foundRecords;
        });
}

function queryUsers(filter, orderBy) {
    return queryCollection(USER_COLL, filter, orderBy);
}

function queryRequests(filter, orderBy) {
    return queryCollection(REQUEST_COLL, filter, orderBy);
}

function queryChats(filter, orderBy) {
    return queryCollection(CHAT_COLL, filter, orderBy);
}

/** saves new object for requested sms send */
function registerSms(messageResource, userId) {
    /** fix for: messageResource Couldn't serialize object of type "V2010"
     * for some reason messageResource comes not as a plain object (with methods) */
    const model = [
        'priceUnit', 'numSegments', 'errorMessage', 'errorCode', 'body', 'uri', 
        'dateUpdated', 'sid', 'apiVersion', 'dateCreated', 'messagingServiceSid', 'price',
        'subresourceUris', 'numMedia', 'from', 'to', 'accountSid', 'dateSent', 'direction', 'status'
    ];  
    const smsLog = model.reduce((acc, key) => {
        acc[key] = messageResource[key];
        return acc;
    }, {});

    const { sid } = messageResource;
    return _createData(SMS_LOGS_COLL, sid, { ...smsLog, userId });
    /** TODO: remove this shit */
    // const userPromise = updateUser(userId, { 'last_notifications.sms': { sid, createdAt: Date.now() } });
    // const smsPromise = _createData(SMS_LOGS_COLL, sid, { ...smsLog, userId });
    // return Promise.all([userPromise, smsPromise]);
}

/** used by twilio-webhook to update sent sms statuses */
function updateSmsStatus(statusData) {
    const { SmsSid } = statusData;
    return SMS_LOGS_COLL.doc(SmsSid).update({ updates: FieldValue.arrayUnion(statusData) }, { create: true });
}

function createSmsTemplate(templateId, data) {
    return _createData(SMS_TEMPLATES_COLL, templateId, data);
}

function updateSmsTemplate(templateId, fields) {
    const modifiedFields = _clearSysFields(fields);
    return SMS_TEMPLATES_COLL.doc(templateId).update(modifiedFields);
}

function getSmsTemplateById(templateId) {
    return SMS_TEMPLATES_COLL.doc(templateId).get()
    .then(_snapShotToObject);
}

module.exports = {
    generateUserId,
    generateChatId,
    generateRequestId,
    createChat,
    createRequest,
    createUser,
    getUserByEmail,
    addRequestToUser,
    deleteChatMember,

    getChatById,
    getRequestById,
    getUserById,
    updateUser,
    updateChat,

    getAdmins,

    queryUsers,
    queryRequests,
    queryChats,

    registerSms,
    updateSmsStatus,
    createSmsTemplate,
    updateSmsTemplate,
    getSmsTemplateById,

    _debugFetch,
}
