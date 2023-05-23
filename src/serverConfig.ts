import io from 'socket.io-client';
import { piecesInPlay } from './State/Grid.state';
export let roomId = ''
export let userId = ''
export let player = ''
export let turn = 1
export let playerColor = ''
import $ from "jquery";
//@ts-ignore
export const socket = io.connect('http://localhost:8080')

export async function connectToRoom(roomId: string, givenPlayer: string) {
    socket.emit('join-room', roomId, 10)
    if(givenPlayer === 'player2') {
        turn = -1
    }
    playerColor = ((givenPlayer === 'player1') ? 'White' : 'Black');

    player = givenPlayer
}

export function invert (num: number) {
    if(num === 0)
        return 7

    return (7 - num) % 7;
}

socket.on('connected', (room: string, user: string) => {
    roomId = room
    userId = user
})


socket.on('piece-movement-server', (oldPosition: any, newPosition: any, whichPlayer: string, isEx: string) => {
    if(whichPlayer !== player) {
        piecesInPlay[invert(oldPosition.col)][invert(oldPosition.row)].move(invert(newPosition.col), invert(newPosition.row), {isFromServer: true, isServerEx: isEx === 'true' })
    }
    
    nextTurn(whichPlayer)
})


export function nextTurn(player: string) {
    turn = -turn
    $('#turn').text("Turn: " + ((player === 'player1') ? 'Black' : 'White'))
}