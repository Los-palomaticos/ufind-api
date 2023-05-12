const User = require('../models/Wallet.model');

const walletController = {};


walletController.wallet = async (req, res) => {
  const {id} =req.body;
  const montoRecarga = req.body.wallet;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      user.walletBalance += montoRecarga;
      await user.save();
      res.status(200).json({ message: 'Recarga realizada exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al realizar la recarga' });
  }
};

module.exports = walletController;