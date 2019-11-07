const express = require('express');
const router = express.Router();
const store = require('../database/firestore');

const filterQueryMiddleware = (req, res, next) => {
    if (req.query.filter) {
        req.query.filter = JSON.parse(req.query.filter);
    }
    next();
}

router.get('/', (req, res) => {
    res.send('ok admin');
});

router.get('/users/:id?', filterQueryMiddleware, (req, res, next) => {
    // TODO: read the request query correct
    store.queryUsers(req.query.filter, req.query.orderby)
    .then(result => res.json(result))
    .catch(next);
});

router.get('/requests/:id?', filterQueryMiddleware, (req, res, next) => {
    // TODO: read the request query correct
    store.queryRequests(req.query.filter, req.query.orderby)
    .then(result => res.json(result))
    .catch(next);
});

router.get('/chats/:id?', filterQueryMiddleware, (req, res, next) => {
    if (req.params.id) {
        return store.getChatById(req.params.id)
            .then(result => res.json(result))
            .catch(next);
    }

    store.queryChats(req.query.filter, req.query.orderby)
    .then(result => res.json(result))
    .catch(next);
});


module.exports = router;
