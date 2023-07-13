var express = require('express');

const { authentication } = require('../../middlewares/auth.middleware');

var router = express.Router();
const walletController = require('../../controllers/wallet.controller')
const walletValidations = require('../../validators/wallet.validator');
const runValidations = require('../../validators/index.validator');

/**
 * ruta recharge
 * necesita:
 *  - header con token
 *  - ucoins
 */
router.post('/recharge',
  authentication,
  walletValidations.recharge,
  runValidations,
  walletController.recharge
)
module.exports = router;
