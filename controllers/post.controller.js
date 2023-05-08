const publicacionController = {}
var publicaciones = {

}
publicacionController.publish = (req, res) => {
    let { title, description } = req.body
    let { photo } = res

    // Guardar en la base de datos
    console.log(title, description, photo)

    return res.status(200).send()
}

module.exports = publicacionController