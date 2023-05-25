const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const { getToken, validateToken, message } = require('../utils/utils');
const roles = require('../data/role.data');

const userController = {};

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
      user.token = token;
      await user.save();
      return res.status(200).json({ token });
    } else {
      return res.status(400).json(message('Credenciales erroneas', false));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(message('Ocurrio un error al inicar sesion', false));
  }
};

userController.signup = async (req, res) => {
  try {
    const saltRounds = 10;
    const { email, password, username, location } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json(message('El correo electronico ya esta registrado', false));
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ email, password: hash, location, username });
    const token = getToken(newUser);
    newUser.token = token;
    await newUser.save();

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json(message('Ocurrio un error al registrarse', false));
  }
};

userController.editUser = async (req, res) => {
  try {
    const { id } = res.user;

    // Borrar campos que no se deben poder editar en este apartado
    delete req.body['password'];
    delete req.body['birthday'];
    delete req.body['reported'];
    delete req.body['banned'];
    delete req.body['role'];
    delete req.body['token'];

    await User.update({ ...req.body }, {
      where: {
        id
      }
    });

    return res.status(200).json(message('Usuario actualizado', false));
  } catch (error) {
    console.error(error);
    return res.status(500).json(message('Ocurrio un error al actualizar usuario', false));
  }
};

userController.changePassword = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(500).json(message('El Usuario no existente', false));
    }
    if (!req.body.password) {
      return res.status(500).json(message('La contraseña no puede ir vacia', false));
    }
    const saltRounds = 10;
    const { password } = req.body;
    const hash = await bcrypt.hash(password, saltRounds);
    await User.update({ password: hash }, {
      where: {
        id
      }
    });

    return res.status(200).json(message('La contraseña ha sido actualizada', false));
  } catch (error) {
    console.error(error);
    return res.status(500).json(message('Ocurrio un error al actualizar la contraseña', false));
  }
};

userController.ban = async (req, res) => {
   try {
    const { id } = req.body;
    const req_id = res.user.id;
    const req_role = res.user.role;
    const user = await User.findByPk(id);
    if (id == req_id) {
      return res.status(401).json(message('No puede banearse a si mismo', false));
    }

    if (req_role != roles.SUPER && (user.role == roles.ADMIN || user.role == roles.SUPER)) {
      return res.status(401).json(message('Un administrador no puede banear a un administrador', false));
    }

    await User.update({ banned: 1 }, {
      where: {
        id
      }
    });

    return res.status(200).json(message('Usuario baneado', false));
  } catch (error) {
    console.error(error);
    return res.status(500).json(message('Ocurrio un error al banear usuario', false));
  }
};

userController.desban = async (req, res) => {
  try {
    const { id } = req.body;
    const req_id = res.user.id;
    const req_role = res.user.role;
    const user = await User.findByPk(id);
    if (id == req_id) {
      return res.status(401).json(message('No puede desbanearse a si mismo', false));
    }

    if (req_role != roles.SUPER && (user.role == roles.ADMIN || user.role == roles.SUPER)) {
      return res.status(401).json(message('Un administrador no puede banear a un administrador', false));
    }

    await User.update({ banned: 0 }, {
      where: {
        id
      }
    });

    return res.status(200).json(message('Usuario desbaneado', false));
  } catch (error) {
    console.error(error);
    return res.status(500).json(message('Ocurrio un error al desbanear usuario', false));
  }
};

userController.getUserBanneds = async (req, res) => {
  const users = await User.findAll({
    where: {
      banned: 1
    }
  });
  res.send(users);
};

module.exports = userController;
