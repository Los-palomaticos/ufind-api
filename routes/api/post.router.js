const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: "./uploads/"})

const uploadPhoto = require('../../middlewares/uploadPhoto.middleware')
const postController = require('../../controllers/post.controller')

const runValidations = require('../../validators/index.validator')
const postValidations = require('../../validators/post.validator')

const {authentication, authorization} = require('../../middlewares/auth.middleware')
const roles = require('../../data/role.data')

/**
 * ruta getAll
 * necesita:
 *  - header con token
 */
router.get('/getAll',
    authentication,
    postController.getAll
);

/**
 * ruta getReported
 * nesecita:
 *  - header con token
 */
router.get('/getReported',
    authentication,
    authorization([roles.ADMIN, roles.SUPER]),
    postValidations.report,
    runValidations,
    postController.getReported
);

/**
 * ruta getSavedPosts
 * nesecita:
 *  - header con token
 */
router.get('/getUserPosts',
    authentication,
    postController.getUserPosts
);

/**
 * ruta getSavedPosts
 * nesecita:
 *  - header con token
 */
router.get('/getSavedPosts',
    authentication,
    postController.getSavedPosts
);


/**
 * ruta searchByTitleOrDescription:
 * necesita:
 *  - parametro search
 */
router.get('/searchByTitleOrDescription/:search',
    postValidations.search,
    runValidations,
    postController.searchByTitleOrDescription
);

/**
 * ruta searchByLocation:
 * necesita:
 *  - parametro search
 */
router.get('/searchByLocation/:search',
    postValidations.search,
    runValidations,
    postController.searchByLocation
);

/**
 * ruta publish:
 * necesita:
 *  - header con token
 *  - photos
 *  - title
 *  - description
 *  - location (opcional)
 */
router.post('/publish',
    authentication,
    upload.array("photos"),
    postValidations.publish,
    runValidations,
    postController.publish,
    uploadPhoto,
    postController.uploadPhotos
);

/**
 * ruta delete:
 * necesita:
 *  - header con token
 *  - id post a borrar
 */
router.delete('/delete',
    authentication,
    postValidations.delete,
    runValidations,
    postController.delete
);

/**
 * ruta report:
 * necesita:
 *  - header con token
 *  - id post a reportar
 */
router.put('/report',
    authentication,
    postValidations.report,
    runValidations,
    postController.report
)

/**
 * ruta resetReports:
 * necesita:
 *  - header con token
 *  - id post a limpiar de reportes
 */
router.post('/resetReports',
    authentication,
    authorization([roles.ADMIN, roles.SUPER]),
    postValidations.report,
    runValidations,
    postController.resetReports
)

/**
 * ruta savePost
 * necesita:
 *  - header con token
 *  - id del post a guardar
 */
router.post('/savePost',
    authentication, 
    postValidations.savePost,
    runValidations,
    postController.savePost
)

/**
 * ruta deleteSavedPost
 * necesita:
 *  - header con token
 *  - id del post a guardar
 */
router.post('/deleteSavedPost',
    authentication, 
    postValidations.savePost,
    runValidations,
    postController.deleteSavedPost
)

module.exports = router