const express = require('express');
const router = express.Router();
const chatVlidator = require('../middleware/chat-request-validator');
const chatService = require('../services/chat-service');

router.get('/', (req, res) => {
    res.send('ok');
});

/** TODO: middleware to make sure valid & existing params  */
router.get('/chats/:chatId/', chatVlidator, (req, res) => {
    chatService.getChatData(req.query.userId, req.params.chatId, req.query.requestId)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err));
});


module.exports = router;
