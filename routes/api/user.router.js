var express = require('express');
var router = express.Router();
const UserValidations = require('../../validators/user.validator');
const runValidations = require('../../validators/index.validator');

var router = express.Router();
const userController = require('../../controllers/user.controller');
const { authentication, authorization } = require('../../middlewares/auth.middleware');

const roles = require('../../data/role.data')
/**
 * 
 */
router.get('/validateToken',
  authentication,
  userController.validateToken
)

/**
 * ruta getBannedUsers
 * necesita:
 *  - header con token
 */
router.get('/getBannedUsers',
  authentication,
  authorization([roles.ADMIN, roles.SUPER]),
  userController.getBannedUsers
)

/**
 * ruta getReportedUsers
 * necesita:
 *  - header con token
 */
router.get('/getReportedUsers', 
  authentication,
  authorization([roles.ADMIN, roles.SUPER]),
  userController.getReportedUsers
)

/**
 * ruta login
 * necesita:
 *  - email
 *  - password
 */
router.post('/login', 
  UserValidations.login,
  runValidations,
  userController.login
)

/**
 * ruta signup
 * necesita:
 *  - email
 *  - username
 *  - password
 */
router.post('/signup',
  UserValidations.signup,
  runValidations,
  userController.signup
)

/**
 * ruta editUser
 * necesita:
 *  - username
 *  - email
 *  - location
 *  - email_backup
 *  - email_visibility
 *  - profile_visibility
 *  - institution  
 * TODOS OPCIONALES
 */
router.put('/editUser',
  authentication,
  UserValidations.editUser,
  runValidations,
  userController.editUser
)

/**
 * ruta change password
 * necesita:
 *  - header con token
 *  - password
 */
router.put('/changePassword',
  authentication,
  UserValidations.changePassword,
  runValidations,
  userController.changePassword
)

/**
 * ruta ban
 * necesita:
 *  - id del usuario a banear
 */
router.put('/ban',
  authentication,
  authorization([roles.ADMIN, roles.SUPER]),
  userController.ban
)

/**
 * ruta desban
 * necesita:
 *  - id del usuario a desbanear
 */
router.put('/desban',
  authentication,
  authorization([roles.ADMIN, roles.SUPER]),
  userController.desban
)

/**
 * ruta getUser
 * necesita:
 *  - header con token
 */
router.get('/getUser',
  authentication,
  userController.getUser
)

module.exports = router;