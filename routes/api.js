var express = require('express');
var router = express.Router();
const userRouter = require('./api/user.router')
const postRouter = require('./api/post.router')
router.use('/user', userRouter)
router.use('/post', postRouter)

module.exports = router;