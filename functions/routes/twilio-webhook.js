const { print } = require('../services/utils');
const express = require('express');
const router = express.Router();
const webhooks = require('twilio/lib/webhooks/webhooks');
const config = require('../config').twilio;
const store = require('../database/firestore');

/** twilio webhook route to get sms statuses after send was requested */
/** https://www.twilio.com/docs/sms/tutorials/how-to-confirm-delivery-node-js */

const vlidateSignature = (req, res, next) => {
    const signature = req.headers['x-twilio-signature'];
    const expectedSignature = webhooks.getExpectedTwilioSignature(
        config.authToken, 
        config.webhook_url,
        req.body
    );

    if (signature !== expectedSignature) {
        console.error('twilio-webhook invalid signature');
        return res.status(401).send();
    }
    next();
}

router.post('/', vlidateSignature, (req, res, next) => {
    console.log('twilio-webhook call');
    store.updateSmsStatus(req.body)
    .then(docId => res.status(200).send(docId))
    .catch(res.status(500).send);
});

module.exports = router;


