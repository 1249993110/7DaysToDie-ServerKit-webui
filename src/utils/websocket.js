import { emitter, eventTypes } from './event-hub';

const createConnection = (url) => {
    // Create WebSocket connection.
    const socket = new WebSocket(url);

    // Connection opened
    socket.addEventListener('open', function (event) {
        console.log('WebSocket Connected.');
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        //console.log('Message from server ', event.data);
        const data = JSON.parse(event.data);
        switch(data.modEventType){
            case 'Welcome':
                console.log(data.data);
                break;
            case 'ChatMessage':
                emitter.emit(eventTypes.OnChatMessage, data.data);
                break;
            case 'LogCallback':
                emitter.emit(eventTypes.OnConsoleLog, data.data);
                break;
        }
    });

    socket.addEventListener('error', function (event) {
        console.log('Error in websocket', event);
    });

    socket.addEventListener('close', function (event) {
        console.log('Connectiont Closed.', event);
    });

    return socket;
};

let connection;

export function closeWebsocket() {
    connection?.close();
    connection = null;
}

export function startWebsocket(url) {
    try {
        connection?.close();
        connection = createConnection(url);
    } catch (err) {
        console.error(err);
    }
}
