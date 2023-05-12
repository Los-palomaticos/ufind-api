var express = require('express');
var router = express.Router();
const userRouter = require('./api/user.router')
const postRouter = require('./api/post.router')
const walletRouter = require('./api/wallet.router')
router.use('/user', userRouter)
router.use('/post', postRouter)
router.use('/wallet', walletRouter)

module.exports = router;