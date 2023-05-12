var express = require('express');

var router = express.Router();
const walletController = require('../../controllers/wallet.controller')


router.post('/wallet',
walletController.wallet
)
module.exports = router;