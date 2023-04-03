import io from 'socket.io-client';
import { piecesInPlay } from './State/Grid.state';
export let roomId = ''
export let player = ''
export let turn = 1
//@ts-ignore
export const socket = io.connect('http://localhost:8080')

export async function connectToRoom(roomId: string, givenPlayer: string) {
    socket.emit('join-room', roomId, 10)
    if(givenPlayer === 'player2') {
        turn = -1
    }
    player = givenPlayer
}

function invert (num: number) {
    if(num === 0)
        return 7

    return (7 - num) % 7;
}

socket.on('connected', (id: string) => {
    roomId = id
})


socket.on('piece-movement-server', (oldPosition: any, newPosition: any, whichPlayer: string) => {
    if(whichPlayer !== player) {
        console.log('this is play from the other side: ' + whichPlayer)
        console.log('this side is: ' + player)
        piecesInPlay[invert(oldPosition.col)][invert(oldPosition.row)].move(invert(newPosition.col), invert(newPosition.row), true)
    }
        
    console.log('before '+ turn)
    turn = -turn
    console.log('after '+ turn)
})
