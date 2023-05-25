const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: "./uploads/"})

const uploadPhoto = require('../../middlewares/uploadPhoto.middleware')
const postController = require('../../controllers/post.controller')

const runValidations = require('../../validators/index.validator')
const postValidations = require('../../validators/post.validator')

const {authentication} = require('../../middlewares/auth.middleware')

router.get('/getAll',
    postController.getAll
);
router.get('/searchByTitleOrDescription/:search',
    postValidations.search,
    runValidations,
    postController.searchByTitleOrDescription
);
router.get('/searchByLocation/:search',
    postValidations.search,
    runValidations,
    postController.searchByLocation
);
router.post('/publish',
    authentication,
    upload.array("photos"),
    postValidations.publish,
    runValidations,
    postController.publish,
    uploadPhoto,
    postController.uploadPhotos
);
router.delete('/delete',
    authentication,
    postValidations.delete,
    runValidations,
    postController.delete
);

router.post('/report',
    authentication,
    postValidations.report,
    runValidations,
    postController.report
)
module.exports = router