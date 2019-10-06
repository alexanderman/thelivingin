const express = require('express');
const cors = require('cors');
const tildaRequestsService = require('./database/tilda-requests');

const app = express();
app.use(cors({ origin: true }));

app.get('/', (req, res) => res.send('v0.0.1'));
app.post('/tilda-requests', (req, res) => { 
    tildaRequestsService.saveRequest(req.body) 
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err));
});

module.exports = app;
