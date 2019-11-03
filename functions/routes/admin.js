const express = require('express');
const router = express.Router();
const store = require('../database/firestore');

router.get('/', (req, res) => {
    res.send('ok admin');
});

router.get('/users/:id?', (req, res, next) => {
    // TODO: read the request query correct
    store.queryUsers(req.query.filter, req.query.orderby)
    .then(result => res.json(result))
    .catch(next);
});

router.get('/requests/:id?', (req, res, next) => {
    // TODO: read the request query correct
    store.queryRequests(req.query.filter, req.query.orderby)
    .then(result => res.json(result))
    .catch(next);
});


module.exports = router;
