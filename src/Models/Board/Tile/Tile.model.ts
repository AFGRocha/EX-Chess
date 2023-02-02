import * as ex from 'excalibur';


export class Tile extends ex.Raster {
    green = 'rgba(118, 150, 86, 1)'
    beige = 'rgba(238, 238, 210, 1)'

    constructor(public tileWidth: number, public tileHeight: number, public col: number, public row: number) {
      super()
    }
  
    execute(ctx: CanvasRenderingContext2D): void {
      // my custom raster
      ctx.fillStyle = this.getColor(this.col, this.row)
      ctx.fillRect(0, 0, this.tileWidth, this.tileHeight)
    }

    getColor (col: number, row: number) {
        //check if the number is even
        if(this.isEven(col)) {
            if(this.isEven(row)) {
                return this.beige
            }
            else {
                return this.green
            }
        }

        else {
            if(this.isEven(row)) {
                return this.green
            }
            else {
                return this.beige
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

    clone(): ex.Graphic {
        throw new Error('Method not implemented.');
    }
  }