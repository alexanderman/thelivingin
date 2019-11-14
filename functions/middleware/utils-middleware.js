const { adminToken } = require('../config');

const fromPromise = promiseFunction => (req, res, next) => {
    promiseFunction(req, res, next).then(result => res.json(result))
    .catch(next);
}

const filterJson = (req, res, next) => {
    if (req.query.filter) {
        req.query.filter = JSON.parse(req.query.filter);
    }
    next();
}

const validateToken = (req, res, next) => {
    let bearer = req.header('Authorization');
    if (bearer) {
        bearer = bearer.replace('bearer ', '');
        console.log(bearer, adminToken);
        if (bearer === adminToken) {
            return next();
        }
    }
    res.status(401).send('unauthorized');
}

module.exports = {
    fromPromise,
    filterJson,
    validateToken
}
