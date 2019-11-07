const users = require('./_mocks/users.json');
const chats = require('./_mocks/chats.json');
const requests = require('./_mocks/requests.json');

// const functions = require('firebase-functions');
const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const USER_COLL = db.collection('users');
const REQUEST_COLL = db.collection('requests');
const CHAT_COLL = db.collection('chats');


function _saveDoc(collection, id, data) {
    /** remove all keys that start with _ */
    const clearData = Object.keys(data).reduce((acc, key) => {
        if (!/^_.*/.test(key)) {
            acc[key] = data[key];
        }
        return acc;
    }, {}); 
    return collection.doc(id).set(clearData);
}

function createCollection(collection, items) {
    const proms = [];
    items.forEach(item => {
        proms.push(_saveDoc(collection, item._id, item));
    });
    return Promise.all(proms)
        .then(res => console.log(` - collection ${collection.path} created successfully`));
}

module.exports = () => {
    console.log('initializing database');
    const proms = [];
    proms.push(createCollection(USER_COLL, users));
    proms.push(createCollection(CHAT_COLL, chats));
    proms.push(createCollection(REQUEST_COLL, requests));

    return proms;
}


