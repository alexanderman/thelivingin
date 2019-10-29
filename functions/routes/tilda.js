const tildaValidators = require('../middleware/tilda-validators');
const requestService = require('../services/request-submit-service');
const helpersService = require('../services/helper-submit-service');
const express = require('express');
const router = express.Router();

const { requestValidator, helperValidator } = tildaValidators;

router.post('/request', requestValidator, (req, res) => {
    requestService.registerRequest(req.body)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err));
});

router.post('/helper', helperValidator, (req, res) => {
    helpersService.registerHelper(req.body)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err));
});


module.exports = router;
