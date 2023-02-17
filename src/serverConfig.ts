import io from 'socket.io-client';
let roomId = ''
//@ts-ignore
export const socket = io.connect('http://localhost:8080')
//Server test
export async function connectToRoom() {
    socket.emit('join-room', 1, 10)
}

socket.on('connected', (id: string) => {
    roomId = id
})

socket.on('piece-movement', () => {
    console.log(roomId)
})