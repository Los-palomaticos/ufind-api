const Message = require('../models/Message.model');

const chatController = {};


    chatController.chat = async (req, res) => {
      const { mensaje } = req.body;
      
      try {
        const message = await Message.create({
          mensaje,
        });
        res.status(201).json(message);
      } catch (error) {
        res.status(500).json({ message: 'Error al enviar el mensaje' });
      }
      }


module.exports = chatController;