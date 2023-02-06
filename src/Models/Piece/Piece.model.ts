import * as ex from 'excalibur';
import { chess } from '../../main';
import { Resources } from '../../resources';
import { Chess } from '../../Scenes/chess';
import { piecesInPlay } from '../../State/Grid.state';
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
    chess: Chess | null = null
    isSelected: boolean = false
    grid
    
    constructor(asset: ex.ImageSource, position: PiecePosition, grid: TilePosition[][], chess: Chess ) { 
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
          this.chess = chess
    }

    onInitialize() {
        this.graphics.add(this.sprite);
        this.on('pointerdown', () => {
          console.log(this.pos);
        });
    }

    killPiece(killedPiece: Piece) {
        console.log(killedPiece)
        const index = piecesInPlay.indexOf(killedPiece)
        this.chess!.remove(piecesInPlay[index])
        piecesInPlay.splice(index, 1);
    }

    cleanAvailableTiles () {
        for (var moves in this.availableTiles) {
            this.removeChild(this.availableTiles[moves])
        }
    }

    select(){

    }

    move(x: number, y: number){
        console.log(this.pos, this.currentPosition)
        this.pos = new ex.Vector(this.grid[x][y].x + 50, this.grid[x][y].y + 50)
        this.currentPosition = {col: x, row: y}
        for (var moves in this.availableTiles) {
            this.removeChild(this.availableTiles[moves])
        }

        console.log(this.pos, this.currentPosition)
    }

    cancel(piece: Piece) {
        this.chess!.board.on('pointerdown', () => {
            for (var moves in piece.availableTiles) {
                this.removeChild(piece.availableTiles[moves])
            }
            this.chess!.board.off("pointerdown");
        });
    }
}