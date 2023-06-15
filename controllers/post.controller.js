const postController = {};
const {message, mapPosts} = require('../utils/utils');
const Post = require('../models/Post.model');
const Photo = require('../models/Photo.model');
const User = require('../models/User.model');
const { Op } = require('sequelize');
const debug = require('debug')("app:post-controller");
const roles = require('../data/role.data');
postController.getAll = async (req, res) => {
    try {
        let posts = await Post.findAll({
            include: [
                {
                    model: User.scope('publisher'),
                    as: "publisher"
                },
                "photos"
            ],
        })

        // mapear lista de fotos
        if (!posts)
            return res.status(404).json(message(['No hay publicaciones'], true))
        
        let _posts = mapPosts(posts)
        res.status(200).json(_posts)
    } catch(e) {
        debug(e)
        res.status(500).json(message(['Error interno'], false))
    }
}
postController.searchByTitleOrDescription = async (req, res) => {
    try {
        let {search} = req.params
        let posts = await Post.findAll({
            include: [
                {
                    model: User.scope('publisher'),
                    as: "publisher"
                },
                "photos"
            ],
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        description: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ]
            }
        })
        // mapear lista de fotos
        let _posts = mapPosts(posts)
        res.status(200).json(_posts)
    } catch(e) {
        debug(e)
        res.status(500).json(message(['Error interno'], false))
    }
}
postController.searchByLocation = async (req, res) => {
    try {
        let {search} = req.params
        let posts = await Post.findAll({
            include: [
                {
                    model: User.scope('publisher'),
                    as: "publisher"
                },
                "photos"
            ],
            where: {
                locationDescription: {
                    [Op.like]: `%${search}%`
                }
            }
        })
    
        // mapear lista de fotos
        let _posts = mapPosts(posts)
        res.status(200).json(_posts)
    } catch(e) {
        debug(e)
        res.status(500).json(message(['Error interno'], false))
    }
}
postController.getReported = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                {
                    model: User.scope('publisher'),
                    as: "publisher"
                },
                "photos"
            ],
            where: {
                reported: {
                    [Op.gt]: 0
                }
            }
        })
        return res.status(200).json(posts)
    } catch(e) {
        debug(e)
        return res.status(500).json(message(['Error interno'], false))
    }
}


postController.publish = async (req, res, next) => {
    let {user} = res;
    let {title, description, location, locationDescription} = req.body
    try {
        // Guardar post en la base de datos
        const post = await Post.create({
            user_id: user.id,
            title,
            description,
            location,
            locationDescription
        })
        // enviamos el id del post al siguiente middleware
        res.post_id = post.dataValues.id

        next()
    } catch(e) {
        debug(e)
        return res.status(500).json(message(["Error interno"], false))
    }
}
postController.uploadPhotos = async (req, res) => {
    try {
        let { URIs, post_id } = res
        const records = URIs.map(photo => {
            return {
                photo,
                post_id
            }
        })
        await Photo.bulkCreate(records)
        return res.status(200).json(message(["Post subido"], true))

    } catch(e) {
        debug(e)
        return res.status(500).json(message(["Error interno"], false))
    }
}

postController.delete = async (req, res) => {
    try{
        let {role} = res.user;
        let user_id = res.user.id
        let {id} = req.body;
        let condicion = {}
        condicion.id = id;

        if (role != roles.ADMIN)
            condicion.user_id = user_id

        const deleted = await Post.destroy({
            where: {
                [Op.and]: [condicion]
            }
        });
        if (!deleted)
            return res.status(401).json(message(["No se ha podido eliminar"], false));

        return res.status(200).json(message(["Eliminado"], true));
    } catch(e) {
        debug(e)
        return res.status(500).json(message(["Error interno"], false))
    }
}

postController.report = async (req, res) => {
    try {
        let {id} = req.body
        await Post.increment('reported', {
            by: 1,
            where: {
                id
            }
        })
        return res.status(200).json(message(["Post reportado"], true))
    } catch(e) {
        debug(e)
        return res.status(500).json(message(["Error interno"], false))
    }
}

postController.resetReports = async (req, res) => {
    try {
        let {id} = req.body
        await Post.update({
            reported: 0
        },{
            where: {id}
        })
        return res.status(200).json(message(["Reportes reiniciados"], true))
    } catch(e) {
        debug(e)
        return res.status(500).json(message(["Error interno"], false))
    }
}
module.exports = postController