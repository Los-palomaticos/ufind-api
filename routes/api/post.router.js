const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: "../uploads/"})

const uploadPhoto = require('../../middlewares/uploadPhoto.middleware')
const postController = require('../../controllers/post.controller')

router.post('/publish', upload.single("photo"), uploadPhoto, postController.publish)
module.exports = router