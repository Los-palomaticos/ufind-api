var express = require('express');
const UserValidations = require('../../validators/user.validator');
const runValidations = require('../../validators/index.validator');
var router = express.Router();
const userController = require('../../controllers/user.controller')
/* GET users listing. */
router.get('/', userController.getUser)

router.post('/login', 
UserValidations.login,
runValidations,
userController.login)

router.post('/signup',
UserValidations.signup,
 runValidations,
 userController.signup
 )

 router.post('/edituser',
 userController.edituser
 )

module.exports = router;