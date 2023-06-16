const Wallet = require('../models/Wallet.model');
const {success, failure} = require('../utils/utils')

const walletController = {};


walletController.recharge = async (req, res) => {
  const { ucoins } = req.body;

  try {
    
    await Wallet.increment('ucoins', {
      where: {
          user_id:res.user.id
      }, 
      by: ucoins
    });

    return res.status(200).json(success('Monedas añadidas correctamente'));
  } catch (error) {
    console.error(error);
    return res.status(500).json(failure('Error al añadir las monedas'));
  }
};

module.exports = walletController;