var express = require('express');
var router = express.Router();
const userRouter = require('./api/user.router')
const postRouter = require('./api/post.router')
const walletRouter = require('./api/wallet.router')

// Swagger config
const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')

const file  = fs.readFileSync('./swagger/swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
router.use('/user', userRouter)
router.use('/post', postRouter)
router.use('/wallet', walletRouter)

module.exports = router;