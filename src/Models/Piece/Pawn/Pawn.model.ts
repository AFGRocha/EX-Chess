import * as ex from 'excalibur';
import { ImageSource, Vector } from 'excalibur';
import { chess } from '../../../main';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition, PixelPosition } from '../Piece.model';


export class Pawn extends Piece {
    availableMove = new ex.Actor({
        width: 100,
        height: 100,
        pos: new ex.Vector(0, 0),
        color: this.availableTileColor
    });  
    constructor(asset: ImageSource, tilePosition: PiecePosition, grid: TilePosition[][] ) { 
        super(asset,tilePosition,grid);
    }

    onInitialize() {
        this.graphics.add(this.sprite);
        this.on('pointerdown', () => {
          this.select()
        });
    }

    select() {
        this.availableMove.pos = new ex.Vector(0,- 200)
        this.availableMove.on('pointerdown', () => {
            this.move()
        });
        // this.availableMove.pos = new ex.Vector(this.grid[this.currentPosition.col][this.currentPosition.row - 2].x, this.grid[this.currentPosition.col][this.currentPosition.row - 2].y)
        this.addChild(this.availableMove)
    }

    move() {
        console.log(this.pos, this.currentPosition)
        this.currentPosition = {col:  this.currentPosition.col, row: this.currentPosition.row - 2}
        this.pos =new ex.Vector(this.grid[this.currentPosition.col][this.currentPosition.row].x + 50, this.grid[this.currentPosition.col][this.currentPosition.row].y + 50)
        this.removeChild(this.availableMove)
        console.log(this.pos, this.currentPosition)
    }
}