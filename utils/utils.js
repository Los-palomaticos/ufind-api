const message = (message, state) => {
    return {
        message,
        ok: state
    }
}

module.exports = {message}