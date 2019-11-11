const tildaValidators = require('../middleware/tilda-validators');
const requestService = require('../services/request-submit-service');
const helpersService = require('../services/helper-submit-service');
const express = require('express');
const router = express.Router();

const { requestValidator, helperValidator } = tildaValidators;

const allowTildaTest = (req, res, next) => {
    const data = [req.body, req.cookies, req.headers, req.params, req.query];
    const isTest = !!data.filter(item => (item || {}).test === 'test')[0];

    if (isTest) {
        return res.status(200).send('test');
    }
    return next();
}

router.post('/request', allowTildaTest, requestValidator, (req, res, next) => {
    requestService.registerRequest(req.body)
    .then(result => res.json(result))
    .catch(next);
});

router.post('/helper', allowTildaTest, helperValidator, (req, res) => {
    helpersService.registerHelper(req.body)
    .then(result => res.json(result))
    .catch(next);
});


module.exports = router;
