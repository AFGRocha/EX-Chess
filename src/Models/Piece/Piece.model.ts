import * as ex from 'excalibur';
import { Resources } from '../../resources';
import { AvailableMove } from '../AvailableMove/AvailableMove.model';
import { TilePosition } from '../Board/Board.model';

export interface PiecePosition {
    col: number,
    row: number
}

export interface PixelPosition {
    x: number,
    y: number
}

export class Piece extends ex.Actor {
    killed = false;
    currentPosition: PiecePosition
    white = true;
    sprite: ex.Sprite
    availableTileColor = new ex.Color(255, 0, 0, 0.5)
    availableTiles: AvailableMove[] = []
    grid
    
    constructor(asset: ex.ImageSource, position: PiecePosition, grid: TilePosition[][] ) { 
        super({
            pos: ex.vec(grid[position.col][position.row].x + 50, grid[position.col][position.row].y + 50),
            width: 100,
            height: 100,
          });
          this.sprite = asset.toSprite()
          this.sprite.width = 100
          this.sprite.height = 100
          this.currentPosition = position
          this.grid = grid
    }

    onInitialize() {
        this.graphics.add(this.sprite);
        this.on('pointerdown', () => {
          console.log(this.pos);
        });
    }
}