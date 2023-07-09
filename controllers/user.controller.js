const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const { getToken, failure, success } = require('../utils/utils');
const roles = require('../data/role.data');
const { Op } = require('sequelize');

const userController = {};

userController.validateToken = (req, res) => {
  return res.status(200).json(success("Sesión vigente"))
}

userController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.scope('withPassword').findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json(failure(["Credenciales erróneas"]));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      if (user.banned) {
        return res.status(401).json(failure(['Cuenta restringida, contacte con el administrador']))
      }
      const token = getToken(user);
      user.token = token;
      await user.save();
      return res.status(200).json(success(token));
    } else {
      return res.status(401).json(failure(['Credenciales erróneas']));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(failure(['Ocurrió un error al inicar sesión']));
  }
};

userController.signup = async (req, res) => {
  try {
    const saltRounds = 10;
    const { email, password, username, location } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(401).json(failure(['El correo electronico ya esta registrado']));
    }

    const hash = await bcrypt.hash(password, saltRounds);
    await User.create({ email, password: hash, location, username });
    // const token = getToken(newUser);
    // newUser.token = token;
    // await newUser.save();

    res.status(200).json(success("Registro exitoso"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(failure(['Ocurrió un error al registrarse']));
  }
};
userController.getUser = async (req, res) => {
  try {
    return res.status(200).json(success(res.user))
  } catch(e) {
    debug(e)
    return res.status(500).json(failure("Error interno"))
  }
}

userController.getReportedUsers = async (req, res) => {
  try {
    let users = await User.findAll({
      where: {
        reported: {
          [Op.gt]: 0
        }
      }
    })
    return res.status(200).json(success(users))
  } catch(e) {
    debug(e)
    return res.status(500).json(failure("Error interno"))
  }
}

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

    return res.status(200).json(success('Usuario actualizado'));
  } catch (error) {
    console.error(error);
    return res.status(500).json(failure(['Ocurrió un error al actualizar usuario']));
  }
};

userController.changePassword = async (req, res) => {
  try {
    const {password} = req.body;
    const {id} = res.user;
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    await User.update({ password: hash }, {
      where: {
        id
      }
    });
    return res.status(200).json(success('La contraseña ha sido actualizada'));
  } catch (error) {
    console.error(error);
    return res.status(500).json(failure(['Ocurrió un error al actualizar la contraseña']));
  }
};

userController.ban = async (req, res) => {
   try {
    const { id } = req.body;
    const req_id = res.user.id;
    const req_role = res.user.role;
    const user = await User.findByPk(id);
    if (id == req_id) {
      return res.status(401).json(failure(['No puede banearse a si mismo']));
    }

    if (req_role != roles.SUPER && (user.role == roles.ADMIN || user.role == roles.SUPER)) {
      return res.status(401).json(failure(['Un administrador no puede banear a un administrador']));
    }

    await User.update({ banned: 1 }, {
      where: {
        id
      }
    });

    return res.status(200).json(success('Usuario baneado'));
  } catch (error) {
    console.error(error);
    return res.status(500).json(failure(['Ocurrió un error al banear usuario']));
  }
};

userController.desban = async (req, res) => {
  try {
    const { id } = req.body;
    const req_id = res.user.id;
    const req_role = res.user.role;
    const userToDesban = await User.findByPk(id);
    if (id == req_id) {
      return res.status(401).json(failure(['No puede desbanearse a si mismo']));
    }

    if (req_role != roles.SUPER && (userToDesban.role == roles.ADMIN || userToDesban.role == roles.SUPER)) {
      return res.status(401).json(failure(['Un administrador no puede banear a un administrador']));
    }

    await User.update({ banned: 0 }, {
      where: {
        id
      }
    });
    return res.status(200).json(success('Usuario desbaneado'));
  } catch (error) {
    console.error(error);
    return res.status(500).json(failure(['Ocurrió un error al desbanear usuario']));
  }
};

userController.getBannedUsers = async (req, res) => {
  const users = await User.findAll({
    where: {
      banned: 1
    }
  });
  res.status(200).json(success(users));
};

module.exports = userController;
