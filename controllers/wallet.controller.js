const User = require('../models/Wallet.model');
const {getToken, validateToken, message} = require('../utils/utils')
const walletController = {};


walletController.recharge = async (req, res) => {
  const {id} = req.body;
  const { ucoins } = req.body;

  try {
    
    const updatedUser = await User.increment('ucoins', {
    
      where: {
        user_id:res.user.id
    }, 
       by: ucoins });

    return res.status(200).json({ message: 'Monedas añadidas correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al añadir las monedas' });
  }
};

module.exports = walletController;