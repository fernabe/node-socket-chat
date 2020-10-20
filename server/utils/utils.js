const crearMensaje = (nombre, message) =>{
    return{
        nombre,
        message,
        fecha: new Date().getTime()
    }
}

module.exports = {
    crearMensaje
}