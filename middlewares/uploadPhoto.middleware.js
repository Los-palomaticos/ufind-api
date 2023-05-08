const cloudinary = require('cloudinary').v2
const fs = require('fs')
const debug = require('debug')('app:subir-foto-middleware');
const {message} = require('../utils/utils')
const removePhoto = (path) => {
    let response = true;
    fs.rm(path, (err)=>{
        if (err) {
            debug(err);
            response = false;
        }
    });
    return response;
}
const uploadPhoto = async (req, res, next) => {
    try {
        let uri = ""
        let name = req.body.name
        let path = req.file.path
        let uploadedPhoto = await cloudinary.uploader.upload(`${path}`, {public_id: name})
        uri = uploadedPhoto.url
        if (!removePhoto(path)) {
            debug("Error al borrar imagen en los archivos internos")
            return res.status(500).send(message("Error interno", false))
        }

        console.log(path)
        if (uri === "") {
            debug("Error al subir imagen")
            return res.status(500).send(message("Error interno", false))
        }
        res.photo = uri
        
    } catch(e) {
        debug('Error con cloudinary')
        return res.status(500).send(message("Error interno", false))
    }
    next()
}

module.exports = uploadPhoto