import * as ex from 'excalibur';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition } from '../Piece.model';

export class King extends Piece {
    
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}King${tilePosition.col}`, chess);
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        const directionModifier = [
            {x: 0, y: -1}, // Up
            {x: 0, y: 1}, // Down
            {x: 1, y: 0}, // Right
            {x: -1, y: 0}, // Left
            {x: -1, y: -1}, // UpLeft
            {x: -1, y: 1}, // DownLeft
            {x: 1, y: -1}, // UpRight
            {x: 1, y: 1} // DownRight
        ]

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
        
        super.select()
    }
}