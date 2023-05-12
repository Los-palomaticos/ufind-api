const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const {getToken, validateToken} = require('../utils/utils')

const userController = {};

userController.getUser = async (req, res) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] }
    });
    res.send(users);
};

userController.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.scope('withPassword').findOne({ where: { email: email } });

        if (!user) {
            return res.status(400).json({ message: 'Credenciales erroneas' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = getToken(user);
            console.log(user.token)
            user.token = token;
            console.log(token, user.token)
            user.save()
            // await user.update('token', token, {
            //     where: {email}
            // })
            return res.status(200).json({token});
        } else {
            res.status(400).json({ message: 'Credenciales erroneas' });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrió un error al iniciar sesión' });
    }
};

userController.signup = async (req, res) => {
    try {
        const saltRounds = 10;
        const { email, password, username, location } = req.body;
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            res.status(400).json({ message: 'El correo electrónico ya está registrado' });
            return;
        }

        const hash = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({ email, password: hash, location, username });
        const token = getToken(newUser);
        newUser.token = token;
        await newUser.save();

        res.status(200).json({token});
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrió un error al registrarse' });
    }
};



userController.edituser = async (req, res) => {
    try {
     
      const {id} = req.body;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'El usuario no existe.' });
      }
      
        await User.update({ ...req.body}, {    
        where: {
            id
        }      
      });
     
      res.json({ message: 'El usuario ha sido actualizado.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al actualizar el usuario.' });
    }
}   

module.exports = userController;
