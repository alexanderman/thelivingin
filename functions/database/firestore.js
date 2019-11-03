const { print } = require('../services/utils');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const USER_COLL = db.collection('users');
const REQUEST_COLL = db.collection('requests');
const CHAT_COLL = db.collection('chats');

function _snapShotToObject(snapshot) {
    if (!snapshot.exists) 
        return null;
    return {
        ...snapshot.data(),
        _id: snapshot.id,
        _createTime: snapshot.createTime.toDate(),
        _updateTime: snapshot.updateTime.toDate(),
        _readTime: snapshot.readTime.toDate()
    };
}

function _createData(collection, id, data) {
    data.createdAt = Date.now();
    return collection.doc(id).set(data);
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
    return USER_COLL.doc(id).update(fields);
}

function createRequest(id, data) {
    return _createData(REQUEST_COLL, id, data);
}

function createChat(id, data) {
    return _createData(CHAT_COLL, id, data);
}

function updateChat(id, fields) {
    return CHAT_COLL.doc(id).update(fields);
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

module.exports = {
    generateUserId,
    generateChatId,
    generateRequestId,
    createChat,
    createRequest,
    createUser,
    getUserByEmail,
    addRequestToUser,

    getChatById,
    getRequestById,
    getUserById,
    updateUser,
    updateChat,

    queryUsers,
    queryRequests,

    _debugFetch
}
