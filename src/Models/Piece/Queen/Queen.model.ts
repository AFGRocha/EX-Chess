import * as ex from 'excalibur';
import { longDistanceMixin } from '../../../Mixins/LongMovementPiece.mixin';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { AvailableMove } from '../../AvailableMove/AvailableMove.model';
import { TilePosition } from '../../Board/Board.model';
import { King } from '../King/King.model';
import { Piece, PiecePosition } from '../Piece.model';

const LongDistancePiece = longDistanceMixin(Piece)
export class Queen extends LongDistancePiece {
    directionModifier = [
        {x: 0, y: -1}, // Up
        {x: 0, y: 1}, // Down
        {x: 1, y: 0}, // Right
        {x: -1, y: 0}, // Left
        {x: -1, y: -1}, // UpLeft
        {x: -1, y: 1}, // DownLeft
        {x: 1, y: -1}, // UpRight
        {x: 1, y: 1} // DownRight
    ]
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}Queen${tilePosition.col}`, chess);
        this.exAmount = 300
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        if(!this.chess?.exMeter.isOn)
            this.longDistanceMove(this.directionModifier, piecesInPlay)

        super.select()
    }

    DrawExMove() {
        for (var pieces in piecesInPlay) {
            for(var piece in piecesInPlay[pieces]) {
                if(piecesInPlay[pieces][piece] 
                    && piecesInPlay[pieces][piece].pieceColor == this.pieceColor 
                    && piecesInPlay[pieces][piece] instanceof King) {
                        const king = piecesInPlay[pieces][piece]
                        const vectorX = (piecesInPlay[pieces][piece].currentPosition.col - this.currentPosition.col) * 100
                        const vectorY = (piecesInPlay[pieces][piece].currentPosition.row - this.currentPosition.row) * 100
                        const vector = new ex.Vector(vectorX, vectorY)
                        const availableMove = new AvailableMove(vector, this.availableTileColor)
                        availableMove.on('pointerdown', () => {
                            const kingPosition = king.currentPosition
                            const queenPosition = this.currentPosition
                            
                            king.move(queenPosition.col,queenPosition.row)
                            this.move(kingPosition.col, kingPosition.row) // because i call move there's no need to call spendMeter
                            piecesInPlay[queenPosition.col][queenPosition.row] = king
                            for (var moves in this.availableTiles) {
                                this.removeChild(this.availableTiles[moves])
                            }
                        })
                        this.addChild(availableMove)
                        this.availableTiles.push(availableMove)

                } 
            } 
        }
    }
}