import * as ex from 'excalibur';

export interface TilePosition {
    x: number,
    y: number
}

export class Board extends ex.Actor {
    private tileColor = { green: new ex.Color(118, 150, 86, 1), beige: new ex.Color(238, 238, 210, 1)}
    public tiles: TilePosition[][] = []

    constructor( public cols: number = 8, public rows: number = 8) {
        super({
            name: 'Board',
            pos: new ex.Vector(0, 0),
            anchor: ex.Vector.Zero,
        });

        const width = 100, height = 100
        for (let i = 0; i < this.cols; i++) {
            this.tiles.push([])
            for (let j = 0; j < this.rows; j++) {
                const tile = new ex.Rectangle({
                    width: width,
                    height: height,
                    color: this.getColor(i,j),
                })
                this.tiles[i].push({x: i * width, y: j * height})
                this.graphics.show(tile, { 
                    anchor: ex.Vector.Zero,
                    offset: ex.vec(i * width, j * height)
                })
            }
        }
    }

    getColor (col: number, row: number) {
        //check if the number is even
        if(this.isEven(col)) {
            if(this.isEven(row)) {
                return this.tileColor.beige
            }
            else {
                return this.tileColor.green
            }
        }

        else {
            if(this.isEven(row)) {
                return this.tileColor.green
            }
            else {
                return this.tileColor.beige
            }
        }
    }

    isEven(number: number) {
        if(number % 2 == 0) {
            return true
        }
        // if the number is odd
        else {
            return false
        }
    }

  }