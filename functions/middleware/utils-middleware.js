
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

module.exports = {
    fromPromise,
    filterJson
}