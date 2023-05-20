var express = require('express');
const { authentication } = require('../../middlewares/auth.middleware');
var router = express.Router();
const walletController = require('../../controllers/wallet.controller')
const WalletValidations = require('../../validators/wallet.validator');
const runValidations = require('../../validators/index.validator');


router.post('/recharge',
authentication,
WalletValidations.recharge,
runValidations,
walletController.recharge
)
module.exports = router;