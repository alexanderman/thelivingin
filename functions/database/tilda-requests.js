const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const tildaRequestsColl = db.collection('tilda-requests');

const saveRequest = requestBody => tildaRequestsColl.add({ ...requestBody, createdAt: new Date() });

module.exports = {
    saveRequest
};
