
const Wallet = require('../models/Wallet.model');

const walletController = {};


walletController.recharge = async (req, res) => {
  const debug = require('debug')('app:wallet-controller')


  try {
    
      console.log(res.user)
      const {ucoins} = req.body ;
      
      
      await Wallet.update({ ucoins:ucoins}, {    
        where: {
            wallet_id:res.user.id
        }      
      });
    
      return res.status(200).json(message('Recarga realizada exitosamente', false));
    }
  catch (error) {
    debug(error)
    return res.status(500).json(message('Error al realizar la recarga', false));
    
  }
};

module.exports = walletController;