const debug = require('debug')('app:menu-validator');
const { body } = require('express-validator');
const validations = {};

validations.recharge = [
    body('id')
    .notEmpty().withMessage('Debe ingresar una id'),
    body('ucoins')
    .notEmpty().withMessage('Debe ingresar unas ucoins')
];
module.exports = validations;