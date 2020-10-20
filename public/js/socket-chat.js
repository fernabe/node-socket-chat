var socket = io();

var params = new URLSearchParams( window.location.search);

if( !params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(response){
        console.log(response);
    });
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

socket.on('crearMensaje', function( response ){
    console.log(response);
});

socket.on('listaPersonas', function( response ){
    console.log(response);
});

// Mensajes privados

socket.on('mensajePrivado', function(data){
   console.log('Mensaje privado', data);
});
