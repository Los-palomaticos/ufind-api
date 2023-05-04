var express = require('express');
var router = express.Router();
const userController = require('../../controllers/user.controller')
/* GET users listing. */
router.get('/', userController.getUser)
router.post('/login', userController.login)
router.post('/signup', userController.signup)

module.exports = router;
