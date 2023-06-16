const debug = require('debug')('app:menu-validator');
const { body } = require('express-validator');
const validations = {};

validations.signup = [
    body('username').trim()
    .notEmpty().withMessage('Debe ingresar un nombre de usuario')
    .isAlphanumeric().withMessage('El nombre de usuario debe ser alfanumérico'),
    body('email').trim()
    .notEmpty().withMessage('Debe ingresar un email').bail()
    .isEmail().withMessage('Debe ingresar un email válido'),
    body('password')
    .notEmpty().withMessage('Debe ingresar una contraseña')
    .isLength({min: 6, max: 20}).withMessage('Debe ingresar una contraseña de 6 a 20 caracteres'),
];

validations.login = [
    body('email').trim()
    .notEmpty().withMessage('Debe ingresar un email').bail()
    .isEmail().withMessage('Debe ingresar un email válido'),
    body('password')
    .notEmpty().withMessage('Debe ingresar una contraseña')
];

validations.editUser = [
    body('username').custom(val=> {
        if (val === undefined)
            return true
        else if (val === "")
            return false
        return true
    }).withMessage('Debe ingresar un nombre de usuario').bail()
    .if(body('username').notEmpty())
    .isAlphanumeric().withMessage('El nombre de usuario debe ser alfanumérico'),

    body('email').custom(val=> {
        if (val === undefined)
            return true
        else if (val === "")
            return false
        return true
    }).withMessage('Debe ingresar un email').bail()
    .if(body('email').notEmpty())
    .isEmail().withMessage('Debe ingresar un email válido'),

    body('location').custom(val=> {
        if (val === undefined)
            return true
        else if (val === "")
            return false
        return true
    }).withMessage('Debe ingresar una localización'),

    body('email_backup').custom(val=> {
        if (val === undefined)
            return true
        else if (val === "")
            return false
        return true
    }).withMessage('Debe proveer un email de recuperación')
    .if(body('email_backup').notEmpty())
    .isEmail().withMessage('Debe ingresar un email de recuperación válido'),
    body('email_visibility').custom(val=> {
        if (val === undefined)
            return true
        else if (val === "")
            return false
        return true
    }).withMessage('Debe proveer informacion sobre la visibilidad'),
    body('profile_visibility').custom(val=> {
        if (val === undefined)
            return true
        else if (val === "")
            return false
        return true
    }).withMessage('Debe proveer informacion sobre la visibilidad'),
    body('institution').custom(val=> {
        if (val === undefined)
            return true
        else if (val === "")
            return false
        return true
    }).withMessage('Debe ingresar una institución')    
];
validations.changePassword = [
    body('password')
    .notEmpty().withMessage('Debe ingresar una contraseña')
    .isLength({min: 6, max: 20}).withMessage('Debe ingresar una contraseña de 6 a 20 caracteres'),
];

validations.getByEmail = [
    body('token').trim()
    .notEmpty().withMessage('No ha iniciado sesion').bail()
];

module.exports = validations;