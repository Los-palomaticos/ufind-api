const User = require("../models/User.model");
const roles_list = require('../data/role.data');
const debug = require('debug')('app:auth-middleware')
const { failure, validateToken } = require("../utils/utils");
const tokenPrefix = "Bearer"
const middlewares = {};

middlewares.authentication = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if (!authorization) {
            return res.status(401).json(failure('No autorizado'));
        }
        const [prefix, token] = authorization.split(" ");
        
        if (prefix !== tokenPrefix || !token){
            return res.status(401).json(failure('No autorizado'));
        }
        const payload = validateToken(token);
        if (!payload) {
            return res.status(401).json(failure('No autorizado'));
        }
        const {id} = payload.data;
        const user = await User.findByPk(id);
        if (!user){
            return res.status(401).json(failure('No autorizado'));
        }

        const isValidToken = user.token;
        
        if (!isValidToken) {
            return res.status(401).json(failure('No autorizado'));
        }
        res.user = user;
        res.token = token;
        next();
    } catch(e) {
        debug(e)
        return res.status(500).json(failure(''))
    }
}
/**
 * Autorizar segun rol de usuario
 * @function
 * @param {[string] | undefined} role 
 * @returns {void}
 */
middlewares.authorization = (roles=[roles_list.ADMIN]) => {
    return (req, res, next) => {
        try{
            const {role = ""} = res.user;
            const check = roles.findIndex(_role => role==_role)
            if (check<0)
                return res.status(403).json(failure('Permisos insuficientes'));
            next();
        } catch(e) {
            debug(e)
            return res.status(500).json(failure('Error interno'));
        }
    }
}
module.exports = middlewares;