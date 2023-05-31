import io from 'socket.io-client';
import { piecesInPlay } from './State/Grid.state';
export let roomId = ''
export let userId = ''
export let player = ''
export let turn = 1
export let playerColor = ''
import $ from "jquery";
import { King } from './Models/Piece/King/King.model';

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
        nextTurn(whichPlayer)
    }
})

let whiteKing: King | null = null
let blackKing: King | null = null

export function nextTurn(player: string) {
    turn = -turn
    $('#turn').text("Turn: " + ((player === 'player1') ? 'Black' : 'White'))

    if(player === 'player1') {
        kingCheck(blackKing!, 'White')
    } else {
        kingCheck(whiteKing!, 'Black')
    }
}

export function setKings(white: King, black: King) {
    whiteKing = white,
    blackKing = black
}

export function getKing() {
    if(player === 'player1') {
        return { king: whiteKing, enemy: 'Black'}
    } else {
        return { king: blackKing, enemy: 'White'}
    }
}

let isCheck = false;

export function kingCheck(king: King, enemyColor: string) {
    const enemyPieces = piecesInPlay.flatMap((innerArray) => 
        innerArray.filter((piece) => {
            if(piece != null)
                return piece.pieceColor === enemyColor;
        })
    )


    let possibleEnemyMoves: {col: number, row: number}[] = []
    enemyPieces.forEach(function (piece) {
        console.log(piece.getPossibleMoves())
        possibleEnemyMoves = possibleEnemyMoves.concat(piece.getPossibleMoves())
    }); 

    console.log(possibleEnemyMoves)
    isCheck = king.check(possibleEnemyMoves)

    if(isCheck) {

    }
}

export function getIsCheck() {
    return isCheck
}