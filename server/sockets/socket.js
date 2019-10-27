const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');


const ticketControl = new TicketControl();


io.on('connection', (client) => {

    client.on('siguienteTicket',(data, callback)=>{

        let siguiente = ticketControl.siguiente();
        console.log(siguiente);
        callback(siguiente);
    });

    //emitir un evento 'estadoActual' (debe retornar el ultimo ticket)
    client.emit('estadoActual',{
        actual: ticketControl.getUltimoTicket(),
        ultimosCuatro: ticketControl.getUltimosCuatro()
    });

    client.on('atenderTicket',(data, callback)=>{

        if(!data.escritorio){
            return callback({
                err:true,
                mensaje: 'El escritorio es necesario'
            });
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio);
        
        //actualizar / notificar cambios en los ULTIMOS 4
        //emitir 'ultimosCuatro'
        client.broadcast.emit('ultimosCuatro',{
            ultimosCuatro: ticketControl.getUltimosCuatro()
        });

        callback(atenderTicket);

    });

});