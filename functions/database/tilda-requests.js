const { print } = require('../services/utils');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;

// admin.initializeApp(functions.config().firebase);
// const db = admin.firestore();
// const tildaRequestsColl = db.collection('dbg-tilda-requests'); // debug

/** DEPRECATED */
const saveRequest = requestBody => {
    const data = { ...requestBody, createdAt: FieldValue.serverTimestamp() };
    const newDocRef = tildaRequestsColl.doc();

    return newDocRef.set(data)
    // return tildaRequestsColl.add({ ...requestBody, createdAt: FieldValue.serverTimestamp() })
    .then(savedSnapShot => {
        print(savedSnapShot, '### saved:');
        return savedSnapShot;
    })
    .catch(err => {
        print(err, '### error');
        throw err;
    });
}

const fetchById = id => {
    console.log('### fetchById:', id);
    return tildaRequestsColl.doc(id).get()
    .then(snapShot => {
        print(snapShot, '### fetched snapShot');
        print(snapShot.data(), '### fetched data:');            
        return snapShot.data();
    })
    .catch(err => {
        print('err', '### error');
        throw err;
    });
};

fetchAll = () => {
    return tildaRequestsColl.get()
    .then(snapShot => {
        if (snapShot.empty) {
            return null;
        }
        const returnData = [];
        snapShot.forEach(doc => {
            console.log(doc.id, doc.createTime.toDate(), '=>', doc.data());
            returnData.push(doc.data());
        });
        return returnData;
    });
};

fetchItem = (collection, itemId) => {
    return db.collection(collection).doc(itemId).get()
    .then(snapShot => snapShot.data());
};

module.exports = {
    saveRequest,
    fetchById,
    fetchAll,
    fetchItem
};

/**
 * TODO:
 *  - import helpers into firestore (create some mock data in db for tests)
 * 
 * Flow on help request submit:
 *  - save user + get userId
 *  - parrelel create Chat and Request with the userId
 *  - 
 * 
 * 
 * Tables: 
    * Requests 
    *  - add field "issuedBy"
    * 
    * User:
    *  - id, email, name
    *  - canHelp: bool
    *  - helpDesc
    *  - requests:[tildaRequestId]
    *  - helps:[helpId]
    *  - role: [admin]
    * 
    * Chat: 
    *  - id
    *  - issuedBy: userId
    *  - messages: [{ issuedBy, text, datetime }]
    * 
    * 
 */