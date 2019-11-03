const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('ok');
});

router.get('/chats/:chatId/', (req, res, next) => {
    chatService.getChatData(req.query.userId, req.params.chatId, req.query.requestId)
    .then(result => res.json(result))
    .catch(next);
});

router.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        error: err.message
    });
});

module.exports = router;
