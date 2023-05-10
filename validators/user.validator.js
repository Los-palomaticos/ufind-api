const debug = require('debug')('app:menu-validator');
const { body } = require('express-validator');
const validations = {};

validations.create = [
    body('username').trim()
    .notEmpty().withMessage('El nombre de usuario no puede estar vacío'),
    body('email').trim()
    .notEmpty().withMessage('El email no puede estar vacío').bail()
    .isEmail().withMessage('Debe ingresar un email válido'),
    body('password')
    .notEmpty().withMessage('La contraseña no puede estar vacía'),
];

validations.login = [
    body('email').trim()
    .notEmpty().withMessage('Debe ingresar un email').bail()
    .isEmail().withMessage('Debe ingresar un email válido'),
    body('password')
    .notEmpty().withMessage('Debe ingresar una contraseña')
];

validations.signup = [
    body('email').trim()
    .notEmpty().withMessage('Debe ingresar un email').bail()
    .isEmail().withMessage('Debe ingresar un email válido'),
    body('password')
    .notEmpty().withMessage('Debe ingresar una contraseña'),
    body('username')
    .notEmpty().withMessage('Debe ingresar una Username')
];

validations.edituser = [
    body('id')
    .notEmpty().withMessage('Debe ingresar una id'),
    body('username').custom(username=> {
        if (!username)
            return true
        return true
    }).withMessage('El campo de usuario no puede ir vacio')
    
];
validations.changepassword = [
    body('id')
    .notEmpty().withMessage('Debe ingresar una id'),

];

validations.getByEmail = [
    body('token').trim()
    .notEmpty().withMessage('No ha iniciado sesion').bail()
];

validations.update = [
    body('token')
    .notEmpty().withMessage('No está autorizado'),
    body('username').trim()
    .notEmpty().withMessage('El nombre de usuario no puede estar vacío'),
    body('institucion').trim()
    .optional()
    .notEmpty().withMessage('La institución no puede estar vacía'),
    body('telefono').trim()
    .optional()
    .notEmpty().withMessage('El teléfono no puede estar vacía'),
];

module.exports = validations;