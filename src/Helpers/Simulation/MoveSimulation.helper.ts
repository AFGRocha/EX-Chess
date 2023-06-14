import { Bishop } from "../../Models/Piece/Bishop/Bishop.model"
import { King } from "../../Models/Piece/King/King.model"
import { Knight } from "../../Models/Piece/Knight/Knight.model"
import { Pawn } from "../../Models/Piece/Pawn/Pawn.model"
import { Piece } from "../../Models/Piece/Piece.model"
import { Queen } from "../../Models/Piece/Queen/Queen.model"
import { Rook } from "../../Models/Piece/Rook/Rook.model"


function createObject(className: string, data: Piece) {
    switch (className) {
        case 'King':
            return new King(data.sprite.image, data.currentPosition, data.grid, data.pieceColor, data.chess!);
        case 'Queen':
            return new Queen(data.sprite.image, data.currentPosition, data.grid, data.pieceColor, data.chess!);
        case 'Knight':
            return new Knight(data.sprite.image, data.currentPosition, data.grid, data.pieceColor, data.chess!);
        case 'Rook':
            return new Rook(data.sprite.image, data.currentPosition, data.grid, data.pieceColor, data.chess!);
        case 'Bishop':
            return new Bishop(data.sprite.image, data.currentPosition, data.grid, data.pieceColor, data.chess!);
        case 'Pawn':
            return new Pawn(data.sprite.image, data.currentPosition, data.grid, data.pieceColor, data.chess!); 
        default:
          throw new Error(`Unknown class name: ${className}`);
      }
}

export function simulateMove(board: any[][], move: any) {
    let tempBoard: any[][] = [[],[],[],[],[],[],[],[]]

    for (var pieces in board) {
        for(var piece in board[pieces]) {
            if(board[pieces][piece]) {
                const className = board[pieces][piece].constructor.name
                const newPiece = createObject(className, board[pieces][piece])
                tempBoard[pieces][piece] = newPiece
            }
            else
                tempBoard[pieces][piece] = null
        }
    }

    const pieceCopy = tempBoard[move.piecePosition.col][move.piecePosition.row]
    tempBoard[move.piecePosition.col][move.piecePosition.row] = null
    pieceCopy.currentPosition = {col: move.col, row: move.row}
    tempBoard[move.col][move.row]  = pieceCopy
    
    return tempBoard
}