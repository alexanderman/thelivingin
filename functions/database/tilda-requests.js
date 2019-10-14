const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const tildaRequestsColl = db.collection('dbg-tilda-requests'); // debug

const saveRequest = requestBody => tildaRequestsColl.add({ ...requestBody, createdAt: new Date() });

module.exports = {
    saveRequest
};

/**
 * TODO:
 *  - import helpers into firestore (create some mock data in db for tests)
 * 
 * User:
 *  - id, email, name
 *  - canHelp: bool
 *  - helpDesc
 *  - requests:[tildaRequestId]
 *  - helps:[helpId]
 * 
 * Chat: 
 *  - id
 *  - createdBy: userId
 *  - messages: [{ from, text, datetime }]
 * 
 * 
 */