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
        // Up
        for(let i = 1; i < 8; i++) {
            if(this.grid[this.currentPosition.col][this.currentPosition.row - i])
            this.drawMove(0, i * -100, this.currentPosition.col, this.currentPosition.row - i)
        } 
        
        // Down
        for(let i = 1; i < 8; i++) {
            if(this.grid[this.currentPosition.col][this.currentPosition.row + i])
            this.drawMove(0, i * 100, this.currentPosition.col, this.currentPosition.row + i)
        } 

        // Right
        for(let i = 1; i < 8; i++) {
            if(this.grid[this.currentPosition.col + 1])
            this.drawMove(i * 100, 0, this.currentPosition.col + i, this.currentPosition.row)
        } 

        // Left
        for(let i = 1; i < 8; i++) {
            if(this.grid[this.currentPosition.col - 1])
            this.drawMove(i * -100, 0, this.currentPosition.col - i, this.currentPosition.row)
        } 
        super.select()
    }
}