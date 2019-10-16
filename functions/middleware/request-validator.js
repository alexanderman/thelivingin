
/**
 * https://express-validator.github.io/docs/next/index.html
 */

const { check, body, validationResult } = require('express-validator');

module.exports = [
    body('name').exists().withMessage('parameter "name" is required'),
    body('phone').exists().withMessage('parameter "phone" is required'),
    body('email').isEmail().withMessage('valid parameter "email" is required'),
    body('textarea').exists().withMessage('parameter "textarea" is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


