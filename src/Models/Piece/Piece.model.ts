import * as ex from 'excalibur';
import { Resources } from '../../resources';

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
    
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, pixelPosition: PixelPosition ) { 
        super({
            pos: ex.vec(pixelPosition.x + 50, pixelPosition.y + 50),
            width: 100,
            height: 100,
          });
          this.draggable = true
          this.sprite = asset.toSprite()
          this.sprite.width = 100
          this.sprite.height = 100
          this.currentPosition = tilePosition
    }

    onInitialize() {
        this.graphics.add(this.sprite);
        this.on('pointerdown', () => {
          console.log(this.pos);
        });
    }
}