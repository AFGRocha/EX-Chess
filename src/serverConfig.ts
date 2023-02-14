import io from 'socket.io-client';

const socket = io.connect('http://localhost:8080')
//Server test
export async function connectToRoom() {
    socket.emit('join-room', 1, 10)
}

  