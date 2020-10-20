const { io } = require('../server');
const { Usuarios }  = require('./classes/usuarios')
const { crearMensaje } = require('../utils/utils')

const usuarios = new Usuarios();
io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if( !data.nombre || !data.sala){

            return callback({
                error: true,
                message: ' El nombre es necesario'
            });
        }

        client.join(data.sala);

        usuarios.agregarPersona( client.id, data.nombre, data.sala);
        
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasSala(data.sala) );
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Admin',`${data.nombre} se unió`));
        return callback(usuarios.getPersonasSala(data.sala));
    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id)
        let message = crearMensaje(persona.nombre, data.message);
        client.broadcast.to(persona.sala).emit('crearMensaje', message);

        return callback(message);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Admin',`${personaBorrada.nombre} salió`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasSala(personaBorrada.sala));

    });

    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        let message = crearMensaje(persona.nombre, data.message);
        client.broadcast.to(data.para).emit('mensajePrivado', message);
    })

});