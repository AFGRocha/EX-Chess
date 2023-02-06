import * as ex from 'excalibur';
import { ImageSource, Vector } from 'excalibur';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { AvailableMove } from '../../AvailableMove/AvailableMove.model';
import { Board, TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition, PixelPosition } from '../Piece.model';


export class Pawn extends Piece {
    firstMove = true  
    chess: Chess | null = null
    constructor(asset: ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], chess: Chess ) { 
        super(asset,tilePosition,grid, chess);
        this.chess = chess
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

        const killablePiece1 = piecesInPlay.find(piece => JSON.stringify(piece.currentPosition) === JSON.stringify({col: this.currentPosition.col + 1, row: this.currentPosition.row - 1}))
        const killablePiece2 = piecesInPlay.find(piece => JSON.stringify(piece.currentPosition) === JSON.stringify({col: this.currentPosition.col - 1, row: this.currentPosition.row - 1}))
        
        console.log(piecesInPlay)
        if(killablePiece1) {
            console.log('entrou')
            const killMovePosition = new ex.Vector(100, -100)
            const killMove = new AvailableMove(killMovePosition, this.availableTileColor)
            killMove.on('pointerdown', () => {
                this.move(-1,1)
                this.killPiece(killablePiece1)
            });
            this.addChild(killMove)
            this.availableTiles.push(killMove)
        }
        this.cancel(this)
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