const User = require('../models/User.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
          
          if (!user) 
            return res.status(401).json({ message: 'no esta registrado'});
          const passwordMatch = await bcrypt.compare(password, user.password);
          
          if (passwordMatch) {
            // const token = createToken(user);
            // res.json({ token });
            await user.save()
            return res.status(200).json({ message:  'Correo Aceptado.',});

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
  
  
  try {
    const saltRounds = 10;
    const { email, password,username,location } = req.body;
    const existingUser = await User.findOne({
      where: {
        email
      }
    });
    if (existingUser) {
      
      res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
      return;
    }
    const hash = await bcrypt.hash(password,saltRounds);
    const newUser = await User.create({ email, password: hash,location,username});

    // const token = createToken(newUser);
    // res.json({ token });
    res.status(200).json(newUser);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocurrió un error al registrarse.' });
  }
}
    //res.send("users")
module.exports = userController