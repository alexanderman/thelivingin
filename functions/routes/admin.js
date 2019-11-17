const { print } = require('../services/utils');
const express = require('express');
const router = express.Router();
const config = require('../config');
const store = require('../database/firestore');
const twilio = require('../services/twilio-service');
const { fromPromise, filterJson, validateToken } = require('../middleware/utils-middleware');
const chatService = require('../services/twilio-service/chat-service');

function generateClientChatUrl(userId, chatId, requestId) {
    const sig = Math.random().toString().substr(2);
    return `${config.clientChatUrl}?chatId=${chatId}&userId=${userId}&requestId=${requestId}&sig=${sig}`;
}

function isAdmin(user) {
    return user && user.roles && user.roles.indexOf('admin') > -1;
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
    const { user, chat, request, notification: { sms, email } } = req.body;    

    return Promise.all([
        store.getUserById(user._id),
        sms ? store.getSmsTemplateById(sms.templateId) : Promise.resolve()
    ]).then(([user, smsTemplate]) => {
        if (sms && !smsTemplate) {
            throw new Error(`sms template "${smsTemplateId}" was not found`);
        }
        if (!user) {
            throw new Error(`user with id "${user._id}" was not found`);
        }

        if (smsTemplate) {
            const { phone, name } = user;
            const userChatUrl = generateClientChatUrl(user._id, chat._id, request._id);
            let message = smsTemplate.text.replace(/\{\{user_name\}\}/gi, name);
            message = message.replace(/\{\{chat_url\}\}/gi, userChatUrl);
    
            return Promise.all([
                chatService.addUserToChat(user, chat),
                (!isAdmin(user) ? twilio.sendSms(phone, message) : Promise.resolve()).catch(console.error)
            ]);
        }

        return Promise.all([
            chatService.addUserToChat(user, chat),
        ]);

    }).then(([addUserToChatResult, msgResource]) => {
        return (msgResource ? store.registerSms(msgResource, user._id) : Promise.resolve()).catch(console.error)
    }).then(() => {
        return store.getChatById(chat._id);
    });
}));

router.post('/chats/removemember', fromPromise((req, res, next) => {
    const { user, chat, notification } = req.body;    
    return chatService.removeMember(user, chat)
        .then(() => store.getChatById(chat._id));
}));


/** UNFINISHED */
router.post('/notify', fromPromise(req => {
    const { userId, chatId, requestId, 
        notification: { 
            email: { templateId: emailTemplateId }, 
            sms: { templateId: smsTemplateId } } 
    } = req.body;
    
    Promise.all([
        store.getUserById(userId),
        store.getSmsTemplateById(smsTemplateId),
    ])
    .then(([user, smsTemplate]) => {
        const { phone, name } = user;
        const userChatUrl = generateClientChatUrl(userId, chatId, requestId);
        let message = smsTemplate.text.replace(/\{\{user_name\}\}/gi, name);
        message = message.replace(/\{\{chat_url\}\}/gi, userChatUrl);

        twilio.sendSms(phone, message).then(msgResource => {
            return store.registerSms(msgResource, userId);
        });
        
    });

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

router.post('/__sms', fromPromise((req, res, next) => {
    const { to, message } = req.body;
    return twilio.sendSms(to, message);
}));
/*************************************************/


module.exports = router;
