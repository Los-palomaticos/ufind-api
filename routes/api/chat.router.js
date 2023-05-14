var express = require('express');

var router = express.Router();
const chatController = require('../../controllers/chat.controller')


router.post('/chat',
chatController.chat
)
module.exports = router;