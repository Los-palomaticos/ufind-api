const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: "./uploads/"})

const uploadPhoto = require('../../middlewares/uploadPhoto.middleware')
const postController = require('../../controllers/post.controller')

const runValidations = require('../../validators/index.validator')
const postValidations = require('../../validators/post.validator')

router.get('/getAll',
    postController.getAll
);
router.get('/searchByTitleOrDescription/:search',
    postValidations.searchByTitleOrDescription,
    runValidations,
    postController.searchByTitleOrDescription
);
router.post('/publish',
    upload.array("photos"),
    postValidations.publish,
    runValidations,
    postController.publish,
    uploadPhoto,
    postController.uploadPhotos
);
router.delete('/delete',
    postValidations.delete,
    runValidations,
    postController.delete
);

router.post('/report',
    postValidations.report,
    runValidations,
    postController.report
)
module.exports = router