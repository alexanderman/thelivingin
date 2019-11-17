const { print } = require('../services/utils');
const express = require('express');
const router = express.Router();
const config = require('../config');
const store = require('../database/firestore');
const twilio = require('../services/twilio-service');
const notificationsService = require('../services/twilio-service/notifications-service');
const { fromPromise, filterJson, validateToken } = require('../middleware/utils-middleware');
const chatService = require('../services/twilio-service/chat-service');

function generateClientChatUrl(userId, chatId, requestId) {
    const sig = Math.random().toString().substr(2);
    return `${config.clientChatUrl}?chatId=${chatId}&userId=${userId}&requestId=${requestId}&sig=${sig}`;
}

router.get('/', (req, res) => res.send('ok admin'));
router.use(validateToken);

router.get('/users/:id?', filterJson, fromPromise(
    req => store.queryUsers(req.query.filter, req.query.orderby)
));

router.get('/requests/:id?', filterJson, fromPromise(
    req => store.queryRequests(req.query.filter, req.query.orderby)
));

router.get('/chats/:id?', filterJson, fromPromise(
    req => req.params.id
        ? store.getChatById(req.params.id)
        : store.queryChats(req.query.filter, req.query.orderby)
));

router.get('/admins', fromPromise(store.getAdmins));

router.post('/chats/addmember', fromPromise((req, res, next) => {
    const { user, chat } = req.body;    
    return chatService.addUserToChat(user, chat)
        .then(() => store.getChatById(chat._id));
}));

router.post('/chats/removemember', fromPromise((req, res, next) => {
    const { user, chat } = req.body;    
    return chatService.removeMember(user, chat)
        .then(() => store.getChatById(chat._id));
}));


router.post('/notify-added-to-chat', fromPromise(req => {
    const { userId, chatId, requestId, notification: { sms, email } } = req.body;
    if (!sms /*&& !email*/) {
        return Promise.reject(new Error('must specify at least one notification type'));
    }
    const userChatUrl = generateClientChatUrl(userId, chatId, requestId);
    return notificationsService.sendSmsAddedToChat(userId, sms.templateId, userChatUrl)
        .then(() => store.getUserById(userId));
}));


/** SEED route ***********************************/
router.get('/__seeddb', (req, res, next) => {
    const seedProms = require('../_seed-database')();
    Promise.all(seedProms).then(_ => {
        res.send('seeded successfully');
    }).catch(next);
});
/*************************************************/

/** DEBUG routes *********************************/
router.get('/__db/:collection/:id?', (req, res, next) => {
    const { collection, id } = req.params;
    store._debugFetch(collection, id)
    .then(result => res.json(result))
    .catch(next);
});

/*************************************************/


module.exports = router;
