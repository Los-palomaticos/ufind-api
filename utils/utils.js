const jwt = require('jsonwebtoken');
/**
 * @function
 * Genera un json con un mensaje y un estado de respuesta satisfactorio
 * @param {any} message 
 * @returns {{message: any, ok: boolean}}
 */
const success = (message) => {
    return {
        message,
        ok: true
    }
}
/**
 * @function
 * Genera un json con una lista de mensajes y un estado de respuesta fallido
 * @param {string[]} messages
 * @returns {{message: string, ok: boolean}}
 */
const failure = (messages) => {
    if (typeof messages != typeof [])
        messages = Array(messages) 
    return {
	errors:messages,
        ok: false
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
/**
 * Recibe una lista de posts y devuelve los posts con el campo photos como un arreglo de cadenas de texto
 * @param {[]} posts 
 * @returns {[]}
 */
const mapPosts = (posts) => {
    return posts.map(post => {
        let photos = post.photos.map(photo => {
            return photo.photo
        })
        return {...post.dataValues, photos}
    })
}
module.exports = {success, failure, getToken, validateToken, mapPosts}
