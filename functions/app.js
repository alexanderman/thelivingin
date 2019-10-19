const express = require('express');
const cors = require('cors');
const firestore = require('./database/firestore');
const requestValidator = require('./middleware/request-validator');
const requestService = require('./services/request-service');

const app = express();
app.use(cors({ origin: true }));

app.get('/', (req, res) => res.send('v0.0.1'));

app.post('/request', requestValidator, (req, res) => {
    requestService.registerRequest(req.body)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err));
});

/** DEBUG route */
app.get('/__db/:collection/:id?', (req, res) => {
    const { collection, id } = req.params;
    firestore._debugFetch(collection, id)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err));
});

/**
 * TODO: 
 *  split routes for tilda and client
 */

module.exports = app;
