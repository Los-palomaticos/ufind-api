const User = require("../models/User.model");
const roles = require('../data/role.data');
const debug = require('debug')('app:auth-middleware')
const { message, validateToken } = require("../utils/utils");
const tokenPrefix = "Bearer"
const middlewares = {};

middlewares.authentication = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if (!authorization) {
            return res.status(401).json(message('No autorizado', false));
        }
        const [prefix, token] = authorization.split(" ");
        
        if (prefix !== tokenPrefix || !token){
            return res.status(401).json(message('No autorizado', false));
        }
        const payload = validateToken(token);
        if (!payload) {
            return res.status(401).json(message('No autorizado', false));
        }
        const {id} = payload.data;
        const user = await User.findByPk(id);
        if (!user){
            return res.status(401).json(message('No autorizado', false));
        }

        const isValidToken = user.token;
        
        if (!isValidToken) {
            return res.status(401).json(message('No autorizado', false));
        }
        res.user = user;
        res.token = token;
        next();
    } catch(e) {
        debug(e)
        return res.status(500).json(message(''))
    }
}
/**
 * Autorizar segun rol de usuario
 * @function
 * @param {string | undefined} role 
 * @returns {void}
 */
middlewares.authorization = (role=roles.ADMIN) => {
    return (req, res, next) => {
        try{
            const {roles = ""} = res.user; 
            const roleIndex = roles.findIndex(_role => (_role == role || role == roles.ADMIN));
            if (roleIndex < 0)
                return res.status(403).json(message('Permisos insuficientes', false));
            next();
        } catch(e) {
            return res.status(500).json(message('Error interno', false));
        }
    }
}
module.exports = middlewares;