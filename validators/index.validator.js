const { validationResult } = require('express-validator');
const { failure } = require('../utils/utils');
module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(failure(
            errors.array().map(error => {
                return error.msg
            })
        ));
    }
    next();
}