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

module.exports = {message}