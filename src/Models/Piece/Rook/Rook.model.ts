import * as ex from 'excalibur';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { AvailableMove } from '../../AvailableMove/AvailableMove.model';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition } from '../Piece.model';

export class Rook extends Piece {
    
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}Rook${tilePosition.col}`, chess);
    }

    onInitialize() {
        super.onInitialize()


    }

    select() {
        const directionModifier = [
            {x: 0, y: -1}, // Up
            {x: 0, y: 1}, // Down
            {x: 1, y: 0}, // Right
            {x: -1, y: 0} // Left
        ]
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
        super.select()
    }
}