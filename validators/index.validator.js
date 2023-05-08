const { validationResult } = require('express-validator');
module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array().map(error => {
                return {
                    field: error.param,
                    message: error.msg
                }
            })
        });
    }
    next();
}