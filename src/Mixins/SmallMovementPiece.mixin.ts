import { Piece } from "../Models/Piece/Piece.model";

export type Class = new (...args: any[]) => any;

export function smallDistanceMixin<Base extends Class>(base: Base) {
    return class extends base {
        smallDistanceMove(directionModifierArray: any[], piecesInPlay: Piece[]) {
            const directionModifier = directionModifierArray
            for(let j = 0; j < directionModifier.length; j++) {
                const colPosition = this.currentPosition.col + (1 * directionModifier[j].x)
                const rowPosition = this.currentPosition.row + (1 * directionModifier[j].y)
                const moveVectorX = (1 * directionModifier[j].x) * 100
                const moveVectorY = (1 * directionModifier[j].y) * 100
                const blockingPiece = piecesInPlay.find(piece => 
                    JSON.stringify(piece.currentPosition) === 
                    JSON.stringify({col: colPosition, row: rowPosition}))
                
                if(blockingPiece) {
                    console.log(blockingPiece)
                    if(blockingPiece.pieceColor != this.pieceColor) {
                        this.drawMove(moveVectorX, moveVectorY, colPosition, rowPosition, blockingPiece)
                    } else {
                        continue
                    }
                } 
                
                if(this.grid[colPosition])
                    if(this.grid[colPosition][rowPosition])
                        this.drawMove(moveVectorX, moveVectorY, colPosition, rowPosition)
            }
        }
    }
}