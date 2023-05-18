const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const {getToken, validateToken, message} = require('../utils/utils')
const roles = require('../data/role.data')
const userController = {};

/**
 * Documentado codigo
 * @param {string} req 
 * @param {boolean} res 
 * Hecho por Salvador
 * @function
 */
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

userController.editUser = async (req, res) => {
    try {
     
      const {id} = res.user;
      
      //borrar campos que no se deben poder editar en este apartado
      delete req.body['password']
      delete req.body['birthday']
      delete req.body['reported']
      delete req.body['banned']
      delete req.body['role']
      delete req.body['token']
      
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
userController.changepassword = async (req, res) => {
    try {
     
      const {id} = req.body;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'El usuario no existe.' });
      }
      if (!req.body.password){
    return res.status(404).json({ message: 'La contraseña  no puede ir vacía.' });
    }
    const saltRounds = 10;
    const {password} =req.body;
    const hash = await bcrypt.hash(password, saltRounds);
        await User.update({password:hash}, {    
        where: {
            id
        }      
      });
     
      res.json({ message: 'La contraseña ha sido actualizada.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al actualizar la contraseña.' });
    }
}   
userController.ban = async (req, res) => {
    //SI EL USUARIO ES ADMIN PUEDE BANEAR, LOS DEMAS NO
    //al token hay que ponerle admin id
    try {
        const {id} = req.body;
        const req_id = res.user.id;
        const req_role = res.user.role;
        const user = await User.findByPk(id);
        if (id == req_id)
          return res.status(401).json(message('No puede banearse a si mismo', false))
        
        if (req_role != roles.SUPER && (user.role == roles.ADMIN || user.role == roles.SUPER))
          return res.status(401).json(message('Un administrador no puede banear a un administrador', false))

        await User.update({banned:1}, {    
          where: {
              id
          }
        });
       
        res.status(200).json({ message: 'El usuario ha sido baneado.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrió un error al actualizar el usuario.' });
      }
}    
userController.getUserBanneds = async (req, res) => {
    const users = await User.findAll({
        where:{
            banned: 1
        }
        
    });
    res.send(users);
};

module.exports = userController;
