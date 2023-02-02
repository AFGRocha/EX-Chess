import * as ex from 'excalibur';
import { Tile } from './Tile/Tile.model';

export class Board extends ex.Actor {
    constructor( public cols: number = 8, public rows: number = 8) {
        super({
            name: 'Board',
            pos: new ex.Vector(0, 0),
            scale: new ex.Vector(2, 2),
            anchor: ex.Vector.Zero,
        });

        const width = 50, height = 50
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                const tile = new Tile(width, height, i, j)
                this.graphics.show(tile, { 
                    anchor: ex.Vector.Zero,
                    offset: ex.vec(i * width, j * height)
                })
            }
        }
    }
  }