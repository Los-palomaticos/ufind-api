const debug = require('debug')('app:compra-validator');
const { body, check, param } = require('express-validator');

const validations = {};

validations.publish = [
    check("photos")
    .custom((item, {req}) => {
        if (req.files.length === 0)
            return false
        const err = req.files.filter(file => !file.mimetype.match("image."));
        if (err.length === 0) {
            return true
        }
        return false
    }).withMessage("Debe proveer al menos una imagen"),
    body("title")
    .notEmpty().trim().withMessage("La publicacion debe tener un titulo"),
    body("description")
    .notEmpty().trim().withMessage("La publicacion debe tener una descripción"),
];

validations.delete = [
    body("id")
    .notEmpty().withMessage("Debe proveer la publicacion a eliminar")
]
validations.report = [
    body("id")
    .notEmpty().withMessage("Debe proveer la publicacion a eliminar")
]
validations.searchByTitleOrDescription = [
    param("search")
    .notEmpty().withMessage("Debe proveer un parametro de busqueda")
]
module.exports = validations;
