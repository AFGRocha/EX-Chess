import * as ex from 'excalibur';
import { longDistanceMixin } from '../../../Mixins/LongMovementPiece.mixin';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { AvailableMove } from '../../AvailableMove/AvailableMove.model';
import { TilePosition } from '../../Board/Board.model';
import { King } from '../King/King.model';
import { Piece, PiecePosition } from '../Piece.model';

const LongDistancePiece = longDistanceMixin(Piece)
export class Rook extends LongDistancePiece {
    directionModifier = [
        {x: 0, y: -1}, // Up
        {x: 0, y: 1}, // Down
        {x: 1, y: 0}, // Right
        {x: -1, y: 0} // Left
    ]
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}Rook${tilePosition.col}`, chess);
        this.exAmount = 100
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        if(!this.chess?.exMeter.isOn){
            this.longDistanceMove(this.directionModifier, piecesInPlay)
        }

        super.select() 
    }

    DrawExMove() {
        if(this.chess!.exMeter.bar.width >= 100) {
            for(let j = 0; j < this.directionModifier.length; j++) {
                const blockingPieces: Piece[] = []
                for(let i = 1; i < 8; i++) {
                    const colPosition = this.currentPosition.col + (i * this.directionModifier[j].x)
                    const rowPosition = this.currentPosition.row + (i * this.directionModifier[j].y)
                    if(colPosition < 0 || colPosition > 7 || rowPosition < 0 || rowPosition > 7) {
                        break
                    }
    
                    const moveVectorX = (i * this.directionModifier[j].x) * 100
                    const moveVectorY = (i * this.directionModifier[j].y) * 100
                    if(piecesInPlay[colPosition][rowPosition])
                        if(piecesInPlay[colPosition][rowPosition] instanceof King && piecesInPlay[colPosition][rowPosition].pieceColor === this.pieceColor)
                            break 
                        else
                            blockingPieces.push(piecesInPlay[colPosition][rowPosition])
                    
                    if(this.grid[colPosition])
                        if(this.grid[colPosition][rowPosition])
                            this.drawMove(moveVectorX, moveVectorY, colPosition, rowPosition, blockingPieces)
                } 
            }
        }
        
    }

    drawMove (vectorX: number, vectorY: number, moveX: number, moveY: number, killablePiece: Piece | Piece[] | null = null) {
        const movePosition = new ex.Vector(vectorX, vectorY)
        const availableMove = new AvailableMove(movePosition, this.availableTileColor)
        
        availableMove.on('pointerdown', () => {
            if(killablePiece) {
                if(Array.isArray(killablePiece)) {
                    const index = killablePiece.findIndex(piece => {
                        return piece.currentPosition.col === moveX && piece.currentPosition.row === moveY;
                    });
                    killablePiece.length = index + 1
                    this.killPiece(killablePiece)
                } 
                else
                    this.killPiece(killablePiece)
            }
            this.move(moveX,moveY)
        });
        this.addChild(availableMove)
        this.availableTiles.push(availableMove)
    }

    killPiece(killedPiece: Piece | Piece[]) {
        if(Array.isArray(killedPiece)) {
            for (var piece in killedPiece) {
                this.chess!.remove(piecesInPlay[killedPiece[piece].currentPosition.col][killedPiece[piece].currentPosition.row])
                piecesInPlay[killedPiece[piece].currentPosition.col][killedPiece[piece].currentPosition.row] = null
                this.emitKill(killedPiece[piece])
            }
        }
        else {
            super.killPiece(killedPiece)
        }
    }

    getPossibleMoves () {
        let moves = []
        if(this.chess!.enemyExMeter.bar.width >= 100) {
            for(let j = 0; j < this.directionModifier.length; j++) {
                for(let i = 1; i < 8; i++) {
                    const colPosition = this.currentPosition.col + (i * this.directionModifier[j].x)
                    const rowPosition = this.currentPosition.row + (i * this.directionModifier[j].y)
                    if(colPosition < 0 || colPosition > 7 || rowPosition < 0 || rowPosition > 7) {
                        break
                    }
     
                    if(this.grid[colPosition])
                        if(this.grid[colPosition][rowPosition])
                            moves.push({col: colPosition, row: rowPosition})
                } 
            }
        }
        return moves.concat(this.availableMoves(this.directionModifier, piecesInPlay))
    }
}