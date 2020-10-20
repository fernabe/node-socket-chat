//Funciones para renderizar usuarios
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');
// referencias JQuery
var divUsuarios = $('#divUsuarios');
var formSend = $('#formSend');
var txtMessage = $('#formSend input[name="txtMessage"]');
var divChatbox = $('#divChatbox');
var titleSala = $('#titleSala').find('small');
function renderizarUsuarios(personas) {

    titleSala.text(sala);

    var html = '';
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span>' + sala + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {
        html += '<li>'
        html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);
}

function renderMessages(data, yo) {

    var fecha = new Date(data.fecha);
    var hora = fecha.getHours() + ' : ' + fecha.getMinutes();
    var adminClass = 'info';

    if (data.nombre === "Admin") {
        adminClass = 'danger';
    }

    var html = '';
    if (yo) {

        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + data.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + data.message + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {

        html += '<li class="animated fadeIn">';
        if( data.nombre !== 'Admin'){
            html += '<div class="chat-img"><img src="assets/images/users/3.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '<h5>' + data.nombre + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + data.message + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';

    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


// Listeners


divUsuarios.on('click', 'a', function () {
    var id = $(this).data('id');
    //console.log(id);
});

formSend.on('submit', function (e) {

    e.preventDefault();
    var texto = txtMessage.val();
    if (texto.trim().length === 0) {
        return;
    }
    // Enviar información
    socket.emit('crearMensaje', {
        nombre,
        message: texto
    }, function (response) {
        txtMessage.val('').focus();
        renderMessages(response, true);
        scrollBottom();
    });
});