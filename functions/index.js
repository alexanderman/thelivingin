// const u = require('./services/utils');
const functions = require('firebase-functions');

const app = require('./app');
module.exports = {
    api: functions.https.onRequest(app),
    // trigger: functions.firestore.document('dbg-tilda-requests/{reqId}').onCreate((snapShot, context) => {
    //     u.print(context, 'trigger context:');
    //     u.print(snapShot, 'trigger snapShot:');
    //     u.print(snapShot.data(), 'trigger data:');
    //     return {};
    // })
};

