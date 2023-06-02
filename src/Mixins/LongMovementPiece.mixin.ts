import { Piece } from "../Models/Piece/Piece.model";

export type Class = new (...args: any[]) => any;

export function longDistanceMixin<Base extends Class>(base: Base) {
    return class extends base {
        longDistanceMove(directionModifierArray: any[], piecesInPlay: any[][]) {
            const directionModifier = directionModifierArray
            for(let j = 0; j < directionModifier.length; j++) {
                for(let i = 1; i < 8; i++) {
                    const colPosition = this.currentPosition.col + (i * directionModifier[j].x)
                    const rowPosition = this.currentPosition.row + (i * directionModifier[j].y)
                    if(colPosition < 0 || colPosition > 7 || rowPosition < 0 || rowPosition > 7) {
                        break
                    }

                    const moveVectorX = (i * directionModifier[j].x) * 100
                    const moveVectorY = (i * directionModifier[j].y) * 100
                    const blockingPiece = piecesInPlay[colPosition][rowPosition]
                    
                    if(blockingPiece) {

                        if(blockingPiece.pieceColor != this.pieceColor){
                            this.drawMove(moveVectorX, moveVectorY, colPosition, rowPosition, blockingPiece)
                            break
                        }
                        
                        break
                    } 
                    
                    if(this.grid[colPosition])
                        if(this.grid[colPosition][rowPosition])
                            this.drawMove(moveVectorX, moveVectorY, colPosition, rowPosition)
                } 
            }
        }

        availableMoves(directionModifierArray: any[], piecesInPlay: any[][]) {
            const directionModifier = directionModifierArray
            let moves = []
            for(let j = 0; j < directionModifier.length; j++) {
                for(let i = 1; i < 8; i++) {
                    const colPosition = this.currentPosition.col + (i * directionModifier[j].x)
                    const rowPosition = this.currentPosition.row + (i * directionModifier[j].y)
                    if(colPosition < 0 || colPosition > 7 || rowPosition < 0 || rowPosition > 7) {
                        break
                    }

                    const blockingPiece = piecesInPlay[colPosition][rowPosition]
                    
                    if(blockingPiece) {

                        if(blockingPiece.pieceColor != this.pieceColor){
                            moves.push({col: colPosition, row: rowPosition, piecePosition: this.currentPosition})
                             break
                        }
                        
                        break
                    } 
                    
                    if(this.grid[colPosition])
                        if(this.grid[colPosition][rowPosition])
                        moves.push({col: colPosition, row: rowPosition, piecePosition: this.currentPosition})
                } 
            }

            return moves
        }
    }
}