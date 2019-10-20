const { param, query, validationResult } = require('express-validator');

module.exports = [
    param('chatId').exists().withMessage('url parameter "chatId" is required'),
    query('userId').exists().withMessage('parameter "userId" is required'),
    query('requestId').exists().withMessage('parameter "requestId" is required'),
    query('sig').exists().withMessage('parameter "sig" is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        /** TODO: validate signature here */

        next();
    }
];


