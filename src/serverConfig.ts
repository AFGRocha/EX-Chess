import io from 'socket.io-client';
import { piecesInPlay } from './State/Grid.state';
export let roomId = ''
export let userId = ''
export let player = ''
export let turn = 1
export let playerColor = ''
export let fullRoom = false
import $ from "jquery";
import { King } from './Models/Piece/King/King.model';

//@ts-ignore
export const socket = io.connect('https://ex-chess-server.glitch.me')

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
    fullRoom = false
})

socket.on('player2-ready', () => {})

socket.on('full-room', () => {
    fullRoom = true
})

export const waitForEvent = (socket: any, event: any) => {
    return new Promise((resolve) => {
      socket.once(event, resolve);
    });
};

socket.on('piece-movement-server', (oldPosition: any, newPosition: any, whichPlayer: string, isEx: string) => {
    if(whichPlayer !== player) {
        piecesInPlay[invert(oldPosition.col)][invert(oldPosition.row)].move(invert(newPosition.col), invert(newPosition.row), {isFromServer: true, isServerEx: isEx === 'true' })
        nextTurn(whichPlayer)
    }
})

socket.on('kill-piece-from-server', (whichPlayer: string, killablePiecePosition: any) => {
    if(whichPlayer !== player) {
        piecesInPlay[invert(killablePiecePosition.col)][invert(killablePiecePosition.row)].removeSelf()
        piecesInPlay[invert(killablePiecePosition.col)][invert(killablePiecePosition.row)] = null
    }
})

let whiteKing: King | null = null
let blackKing: King | null = null

export function nextTurn(whichPlayer: string) {
    turn = -turn
    $('#turn').text("Turn: " + ((whichPlayer === 'player1') ? 'Black' : 'White'))

    if(whichPlayer !== player) {
        kingState()
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
let isCheckmate = false;

export function kingCheck(king: King, enemyColor: string) {
    const enemyPieces = piecesInPlay.flatMap((innerArray) => 
        //@ts-ignore
        innerArray.filter((piece) => {
            if(piece != null)
                return piece.pieceColor === enemyColor;
        })
    )


    let possibleEnemyMoves: {col: any; row: any; piecePosition: any;}[] = []
    enemyPieces.forEach(function (piece) {
        possibleEnemyMoves = possibleEnemyMoves.concat(piece.getPossibleMoves())
    }); 

    isCheck = king.check(possibleEnemyMoves)
}

function kingCheckmate(king: King, myColor: string) {
    const myPieces = piecesInPlay.flatMap((innerArray) => 
        //@ts-ignore
        innerArray.filter((piece) => {
            if(piece != null)
                return piece.pieceColor === myColor;
        })
    )
    let possibleMoves: {col: any; row: any; piecePosition: any;}[]  = []
    myPieces.forEach(function (piece) {
        possibleMoves = possibleMoves.concat(piece.getPossibleMoves())
    }); 

    isCheckmate = king.checkmate(possibleMoves)

}

export function getIsCheck() {
    return isCheck
}


function kingState () {
    if(player === 'player1') {
        kingCheck(whiteKing!, 'Black')
    } else {
        kingCheck(blackKing!, 'White')
    }

    if(isCheck) {
        if(player === 'player1') {
            kingCheckmate(whiteKing!, 'White')
        } else {
            kingCheckmate(blackKing!, 'Black')
        }
        socket.emit('king-state', roomId, player, isCheckmate)
    }
}

export function endGame() {
    turn = 2
}