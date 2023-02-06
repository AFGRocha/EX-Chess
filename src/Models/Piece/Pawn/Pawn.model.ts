import * as ex from 'excalibur';
import { ImageSource, Vector } from 'excalibur';
import { chess } from '../../../main';
import { AvailableMove } from '../../AvailableMove/AvailableMove.model';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition, PixelPosition } from '../Piece.model';


export class Pawn extends Piece {
    firstMove = true  
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
        if(this.firstMove) {
            const firstMovePosition = new ex.Vector(0,- 200)
            const firstAvailableMove = new AvailableMove(firstMovePosition, this.availableTileColor)
            firstAvailableMove.on('pointerdown', () => {
                this.move(0,2)
            });
            this.addChild(firstAvailableMove)
            this.availableTiles.push(firstAvailableMove)
        }

        const movePosition = new ex.Vector(0,- 100)
        const availableMove = new AvailableMove(movePosition, this.availableTileColor)
        availableMove.on('pointerdown', () => {
            this.move(0,1)
        });
        this.addChild(availableMove)
        this.availableTiles.push(availableMove)

    }

    move(x: number, y: number) {
        console.log(this.pos, this.currentPosition)
        this.currentPosition = {col:  this.currentPosition.col - x, row: this.currentPosition.row - y}
        this.pos = new ex.Vector(this.grid[this.currentPosition.col][this.currentPosition.row].x + 50, this.grid[this.currentPosition.col][this.currentPosition.row].y + 50)
        for (var moves in this.availableTiles) {
            this.removeChild(this.availableTiles[moves])
        }
        if (this.firstMove){
            this.firstMove = false;
        }
        
        console.log(this.pos, this.currentPosition)
    }
}