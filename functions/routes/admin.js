const express = require('express');
const router = express.Router();
const store = require('../database/firestore');
const { fromPromise, filterJson } = require('../middleware/utils-middleware');
const chatService = require('../services/twilio-service/chat-service');

router.get('/', (req, res) => res.send('ok admin'));

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

router.get('/admins', fromPromise(() => store.getAdmins()));

router.post('/chats/addmember', fromPromise((req, res, next) => {
    const { user, chat, notification } = req.body;    
    return chatService.addUserToChat(user, chat)
        .then(() => store.getChatById(chat._id));
}));

router.post('/chats/removemember', fromPromise((req, res, next) => {
    const { user, chat, notification } = req.body;    
    return chatService.removeMember(user, chat)
        .then(() => store.getChatById(chat._id));
}));


module.exports = router;
