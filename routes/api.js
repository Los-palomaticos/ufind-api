var express = require('express');
var router = express.Router();
const userRouter = require('./api/user.router')
const postRouter = require('./api/post.router')
const walletRouter = require('./api/wallet.router')
const chatRouter = require('./api/chat.router')
router.use('/user', userRouter)
router.use('/post', postRouter)
router.use('/wallet', walletRouter)
router.use('/chat', chatRouter)

module.exports = router;