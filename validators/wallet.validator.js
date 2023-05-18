const debug = require('debug')('app:menu-validator');
const { body } = require('express-validator');
const validations = {};

validations.recharge = [
    body('id')
    .notEmpty().withMessage('Debe ingresar una id'),
    body('ucoins')
    .notEmpty().withMessage('Debe ingresar una cantidad de monedas'),
];
module.exports = validations;