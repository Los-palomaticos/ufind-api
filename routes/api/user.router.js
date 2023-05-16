var express = require('express');
const UserValidations = require('../../validators/user.validator');
const runValidations = require('../../validators/index.validator');
var router = express.Router();
const userController = require('../../controllers/user.controller');
const { authentication, authorization } = require('../../middlewares/auth.middleware');

const roles = require('../../data/role.data')
/* GET users listing. */
router.get('/', userController.getUser)

router.get('/getUserBanneds', userController.getUserBanneds)

router.post('/login', 
UserValidations.login,
runValidations,
userController.login)

router.post('/signup',
UserValidations.signup,
 runValidations,
 userController.signup
 )

 router.put('/edituser',
 UserValidations.edituser,
    runValidations,
   userController.edituser
 )

 router.put('/changepassword',
 UserValidations.changepassword,
    runValidations,
   userController.changepassword
 )
router.put('/ban',
  authentication,
  authorization([roles.ADMIN, roles.SUPER]),
  userController.ban
)
 
 

module.exports = router;
