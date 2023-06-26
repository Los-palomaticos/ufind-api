const postController = {};
const {success, failure, mapPosts} = require('../utils/utils');
const Post = require('../models/Post.model');
const Photo = require('../models/Photo.model');
const User = require('../models/User.model');
const SavedPost = require('../models/SavedPost.model')

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
            order: [
                ['id', 'DESC']
            ]
        })

        // mapear lista de fotos
        if (!posts)
            return res.status(404).json(failure(['No hay publicaciones']))
        
        let _posts = mapPosts(posts)
        res.status(200).json(success(_posts))
    } catch(e) {
        debug(e)
        res.status(500).json(failure(['Error interno']))
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
            },
            order: [
                ['id', 'DESC']
            ]
        })
        // mapear lista de fotos
        let _posts = mapPosts(posts)
        res.status(200).json(success(_posts))
    } catch(e) {
        debug(e)
        res.status(500).json(failure(['Error interno']))
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
            },
            order: [
                ['id', 'DESC']
            ]
        })
    
        // mapear lista de fotos
        let _posts = mapPosts(posts)
        res.status(200).json(success(_posts))
    } catch(e) {
        debug(e)
        res.status(500).json(failure(['Error interno']))
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
        return res.status(200).json(success(posts))
    } catch(e) {
        debug(e)
        return res.status(500).json(failure(['Error interno']))
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
        return res.status(500).json(failure(["Error interno"]))
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
        return res.status(200).json(success("Post subido"))

    } catch(e) {
        debug(e)
        return res.status(500).json(failure(["Error interno"]))
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
            return res.status(401).json(failure(["No se ha podido eliminar"]));

        return res.status(200).json(success("Eliminado"));
    } catch(e) {
        debug(e)
        return res.status(500).json(failure(["Error interno"]))
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
        return res.status(200).json(success("Post reportado"))
    } catch(e) {
        debug(e)
        return res.status(500).json(failure(["Error interno"]))
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
        return res.status(200).json(success("Reportes reiniciados"))
    } catch(e) {
        debug(e)
        return res.status(500).json(failure(["Error interno"]))
    }
}

postController.savePost = async (req, res) => {
    try {
        let post_id = req.body.id
        let user_id = res.user.id
        await SavedPost.create({
            post_id,
            user_id
        })
        return res.status(200).json(success("Post guardado"))
    } catch(e) {
        debug(e)
        return res.status(500).json(failure("No se ha podido guardar el post"))
    }
}
postController.deleteSavedPost = async(req, res) => {
    try {
        let post_id = req.body.id
        let user_id = res.user.id
        await SavedPost.destroy({
            where:{
                [Op.and]: [
                    {post_id},
                    {user_id}
                ]
            }
        })
        return res.status(200).json(success("Post eliminado de la lista de guardados"))
    } catch (e) {
        debug(e)
        return res.status(500).json(failure("No se ha podido eliminar el post de la lista de guardados"))
    }
}
module.exports = postController