import io from 'socket.io-client';
export let roomId = ''
//@ts-ignore
export const socket = io.connect('http://localhost:8080')
//Server test
export async function connectToRoom(roomId: string) {
    socket.emit('join-room', roomId, 10)
    console.log('connectToRoom')
}

socket.on('connected', (id: string) => {
    roomId = id
})