const User = require('../models/User.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function createToken(user) {
  const payload = {
    userId: user.id
  };
  const options = {
    expiresIn: '1d'
  };
  return jwt.sign(payload, config.secretKey, options);
}
const userController = {}
userController.getUser = async(req, res) => {
    const users = await User.findAll({
        attributes:
        { exclude: ['password'] }
    });
    res.send(users)
   
}
userController.login =async(req, res) => {
    
        try {
          const { email, password } = req.body;
          const user = await User.findOne({
            where: {
              email: email
            }
          });
          let passwordMatch = false;
          if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
          }
          if (passwordMatch) {
            const token = createToken(user);
            res.json({ token });
            res.status(200).json({ message:  'Correo Aceptado.',});
          return ;
          }
          else{
            res.status(200).json({ message:  'Credenciales erroneas.'});
            return ;
          }
         
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Ocurrió un error al iniciar sesión.' });
        }
      
    //le va a enviar los datos al usuario para correr la aplicacion, 
    //entre ellos hay id, email. user
}
userController.signup = async(req, res) => {

     const datos = req.body
     const name = datos.username
     const emailbr = datos.email
      res.send(emailbr)
    //res.send("users")
}
module.exports = userController