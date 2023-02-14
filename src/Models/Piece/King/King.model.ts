import * as ex from 'excalibur';
import { smallDistanceMixin } from '../../../Mixins/SmallMovementPiece.mixin';
import { Resources } from '../../../resources';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { AvailableMove } from '../../AvailableMove/AvailableMove.model';
import { TilePosition } from '../../Board/Board.model';
import { Knight } from '../Knight/Knight.model';
import { Pawn } from '../Pawn/Pawn.model';
import { Piece, PiecePosition } from '../Piece.model';
import { Rook } from '../Rook/Rook.model';

const smallDistancePiece = smallDistanceMixin(Piece)

export class King extends smallDistancePiece {
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
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}King${tilePosition.col}`, chess);
        this.exAmount = 300
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        if(!this.chess?.exMeter.isOn)
            this.smallDistanceMove(this.directionModifier, piecesInPlay)

        super.select()
    }


    move(x: number, y: number){
        super.move(x, y)
        
        this.castle(x,y)
        
    }
    castle (x: number, y: number) {
        if(y === 7) {
            if(x === 5) { 
                // is there a piece in f1?
                const possibleBlockingPiece = piecesInPlay[6][7]
                if(!possibleBlockingPiece) {
                    const possibleRook = piecesInPlay[7][7]
                    if (possibleRook instanceof Rook){
                        this.move(6,7)
                        possibleRook.move(5,7)
                    }
                }
            } else if (x === 3) {
                // is there a piece in c1?
                const possibleBlockingPieceC1 = piecesInPlay[2][7]
                // is there a piece in b1?
                const possibleBlockingPieceB1 = piecesInPlay[1][7]
                    
                if(!possibleBlockingPieceC1 && !possibleBlockingPieceB1) {
                    const possibleRook = piecesInPlay[0][7]
                    if (possibleRook instanceof Rook){
                        this.move(2,7)
                        possibleRook.move(3,7)
                    }
                }
            }
        }
        
    }

    DrawExMove () {
        let allPawns: any = []
        if(this.chess!.exMeter.bar.width >= 300) {
            for (var pieces in piecesInPlay) {
                // allPawns = piecesInPlay[pieces].filter(piece => piece.pieceColor === this.pieceColor);
                for(var piece in piecesInPlay[pieces]) {
                    if(piecesInPlay[pieces][piece])
                        if(piecesInPlay[pieces][piece].pieceColor == this.pieceColor && piecesInPlay[pieces][piece] instanceof Pawn)
                            allPawns.push(piecesInPlay[pieces][piece])
                } 
            }

            for (var piece in allPawns) {
                const vectorX = (allPawns[piece].currentPosition.col - this.currentPosition.col) * 100
                const vectorY = (allPawns[piece].currentPosition.row - this.currentPosition.row) * 100
                const vector = new ex.Vector(vectorX, vectorY)
                const availableMove = new AvailableMove(vector, this.availableTileColor)
                availableMove.on('pointerdown', () => {
                    this.chess!.remove( piecesInPlay[allPawns[piece].currentPosition.col][allPawns[piece].currentPosition.row])
                    const newKnight =  new Knight(Resources.WhiteKnight, {col: allPawns[piece].currentPosition.col, row: allPawns[piece].currentPosition.row }, this.chess!.board.tiles, 'White', this.chess!)
                    this.chess!.add(newKnight)
                    piecesInPlay[allPawns[piece].currentPosition.col][allPawns[piece].currentPosition.row] = newKnight

                    for (var moves in this.availableTiles) {
                        this.removeChild(this.availableTiles[moves])
                    }
                    this.spendMeter()
                })
                this.addChild(availableMove)
                this.availableTiles.push(availableMove)
            }
        }
    }
}