const functions = require('firebase-functions');

const app = require('./app');
module.exports.api = functions.https.onRequest(app);
