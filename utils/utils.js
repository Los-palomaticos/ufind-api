const jwt = require('jsonwebtoken');
/**
 * @function
 * Genera un json con mensaje y estado, util para enviar una respuesta al cliente
 * @param {string} message 
 * @param {boolean} state
 * @returns {{message: string, ok: boolean}}
 */
const message = (message, state) => {
    return {
        message,
        ok: state
    }
}

/**
 * @function
 * Genera un token con jsonwebtoken
 * @param {{}} user
 * @returns {string}
 */
const getToken = (user) => {
    const token = jwt.sign({
        data: {
            id:user.id ,
            email: user.email,
            username: user.username,
            role: user.rol,
            institution: user.institution,
            location: user.location,
            photo: user.photo
        }
    }, process.env.TOKEN, {
        expiresIn: '1d'
    })
    return token;
}

/**
 * @function
 * Validar token
 * @param {string} token
 * @returns {string}
 */
const validateToken = (token) => {
    let payload = null;
    try {
        payload = jwt.verify(token, process.env.TOKEN);
    } catch(e) {
    }
    return payload;
}
module.exports = {message, getToken, validateToken}