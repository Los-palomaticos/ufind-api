const cloudinary = require('cloudinary').v2
const fs = require('fs')
const debug = require('debug')('app:subir-foto-middleware');
const {failure} = require('../utils/utils');
const path = require('path');
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
        let paths = []
        let files = req.files
        // en files almacenamos las urls que nos devuelve cloudinary
        let URIs = await Promise.all(
            files.map(async file => {
                paths.push(file.path)
                let uploadedPhoto = await cloudinary.uploader.upload(`${file.path}`)
                return uploadedPhoto.url
            })
        )
        paths.forEach(path => {
            if (!removePhoto(path)) {
                debug("Error al borrar imagen en los archivos internos")
                return res.status(500).send(failure("Error interno"))
            }
        })

        if (URIs.length == 0) {
            debug("Error al subir imagen/es")
            return res.status(500).send(failure("Error interno"))
        }
        res.URIs = URIs
    } catch(e) {
        debug('Error con cloudinary')
        return res.status(500).send(failure("Error interno"))
    }
    next()
}

module.exports = uploadPhoto