const requestValidator = require('../middleware/request-validator');
const requestService = require('../services/request-service');
const express = require('express');
const router = express.Router();

router.post('/request', requestValidator, (req, res) => {
    requestService.registerRequest(req.body)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
