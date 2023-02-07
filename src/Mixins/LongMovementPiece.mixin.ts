import { Piece } from "../Models/Piece/Piece.model";

export type Class = new (...args: any[]) => any;

export function longDistanceMixin<Base extends Class>(base: Base) {
    return class extends base {
        longDistanceMove(directionModifierArray: any[], piecesInPlay: Piece[]) {
            const directionModifier = directionModifierArray
            for(let j = 0; j < directionModifier.length; j++) {
                for(let i = 1; i < 8; i++) {
                    const colPosition = this.currentPosition.col + (i * directionModifier[j].x)
                    const rowPosition = this.currentPosition.row + (i * directionModifier[j].y)
                    const moveVectorX = (i * directionModifier[j].x) * 100
                    const moveVectorY = (i * directionModifier[j].y) * 100
                    const blockingPiece = piecesInPlay.find(piece => 
                        JSON.stringify(piece.currentPosition) === 
                        JSON.stringify({col: colPosition, row: rowPosition}))
                    
                    if(blockingPiece) {
                        if(blockingPiece.pieceColor === this.pieceColor)
                            break
                        else {
                            this.drawMove(moveVectorX, moveVectorY, colPosition, rowPosition, blockingPiece)
                            break
                        }
                    } 
                    
                    if(this.grid[colPosition])
                        if(this.grid[colPosition][rowPosition])
                            this.drawMove(moveVectorX, moveVectorY, colPosition, rowPosition)
                } 
            }
        }
    }
}