import * as ex from 'excalibur';
import { smallDistanceMixin } from '../../../Mixins/SmallMovementPiece.mixin';
import { Resources } from '../../../resources';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { AvailableMove } from '../../AvailableMove/AvailableMove.model';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition } from '../Piece.model';
import { Queen } from '../Queen/Queen.model';


const smallDistancePiece = smallDistanceMixin(Piece)
export class Pawn extends smallDistancePiece {
    killablePieces: Piece[] = []
    enPassantPieces: Piece[] = []

    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}Pawn${tilePosition.col}`, chess);
        this.exAmount = 100;
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        if(!this.chess?.exMeter.isOn){
            if(!piecesInPlay[this.currentPosition.col][this.currentPosition.row - 1]) {
                
                if(this.currentPosition.row === 6 && !piecesInPlay[this.currentPosition.col][this.currentPosition.row - 2]) {    
                    const directionModifier = [
                        {x: 0, y: -2}, // Up x2
                    ]
            
                    this.smallDistanceMove(directionModifier, piecesInPlay)
                } 

                const directionModifier = [
                    {x: 0, y: -1}, // Up 
                ]

                this.smallDistanceMove(directionModifier, piecesInPlay)
                
            }
    
            this.getDiagonalPiecesAndDrawMove()
            this.enPassant()
        }
        
        super.select()
    }

    move(x: number, y: number) {
        super.move(x, y)

        if(!y) {
            this.promote(x)
        }
    }


    getDiagonalPiecesAndDrawMove() {
        
        this.killablePieces.push(piecesInPlay[this.currentPosition.col + 1][this.currentPosition.row - 1])
        if(this.currentPosition.col - 1 >= 0)
            this.killablePieces.push(piecesInPlay[this.currentPosition.col - 1][this.currentPosition.row - 1])


        for (var moves in this.killablePieces) { 
            if(this.killablePieces[moves]) {
                if(this.killablePieces[moves].pieceColor != this.pieceColor) {
                    const killablePiece = this.killablePieces[moves]
                    const drawX = killablePiece.currentPosition.col -this.currentPosition.col 
                    const drawY = killablePiece.currentPosition.row - this.currentPosition.row 
                    this.drawMove(drawX * 100,  drawY * 100, killablePiece.currentPosition.col, killablePiece.currentPosition.row, killablePiece)
                }
            }
        }

        this.killablePieces = []
    }

    enPassant() {
        if(/*this.currentPosition.row === 3 &&*/ true) {
            if(!piecesInPlay[this.currentPosition.col + 1][this.currentPosition.row - 1])
                this.enPassantPieces.push(piecesInPlay[this.currentPosition.col + 1][this.currentPosition.row])
            if(this.currentPosition.col - 1 >= 0)
                if(!piecesInPlay[this.currentPosition.col - 1][this.currentPosition.row - 1])
                    this.enPassantPieces.push(piecesInPlay[this.currentPosition.col - 1][this.currentPosition.row])

            for (var moves in this.enPassantPieces) { 
                if(this.enPassantPieces[moves]) {
                    if(this.enPassantPieces[moves].pieceColor != this.pieceColor) {
                        const killablePiece = this.enPassantPieces[moves]
                        const drawX = killablePiece.currentPosition.col - this.currentPosition.col 

                        this.drawMove(drawX * 100, -100, killablePiece.currentPosition.col, killablePiece.currentPosition.row - 1, killablePiece)
                    }    
                }
            }
            this.enPassantPieces = []
        }
    }

    promote (col: number) {
        this.chess!.remove(this)
        const newQueen = new Queen(Resources.WhiteQueen, {col: col, row: 0 }, this.grid, 'White', this.chess!)
        piecesInPlay[col][0] = newQueen
        this.chess?.add(newQueen)

        // Easter Egg
        console.log('yas queen slay')
    }

    exMove() {
        const directionModifier = [
            {x: 0, y: 1}, // Down
        ]

        this.smallDistanceMove(directionModifier, piecesInPlay)

        if(this.chess?.exMeter.bar.width === 300) {
            let otherPawnLeft
            let otherPawnRight
            if(this.currentPosition.col - 1 >= 0) {
                otherPawnLeft = piecesInPlay[this.currentPosition.col - 1][this.currentPosition.row]

                if(otherPawnLeft) {
                    this.otherPawns.push(otherPawnLeft)
                    this.specialLevel3(-100,0, this.currentPosition.col - 1)
                }
            } 
            if(this.currentPosition.col + 1 <= 7) {
                otherPawnRight = piecesInPlay[this.currentPosition.col + 1][this.currentPosition.row]
                if(otherPawnRight) {
                    this.otherPawns.push(otherPawnRight)
                    this.specialLevel3(100,0, this.currentPosition.col + 1)
                }
            }
                
        }
    }

    specialLevel3(x: number, y: number, col: number) {
        const position = new ex.Vector(x, y)
        const otherPawn = piecesInPlay[col][this.currentPosition.row]
        otherPawn.off('pointerdown')  // ugly solution to double selection
        const availableMove = new AvailableMove(position, this.availableTileColor)
        availableMove.on('pointerdown', () => {
            const child = new Pawn(Resources.WhitePawn, {col: col, row: this.currentPosition.row - 1 }, this.chess!.board.tiles, 'White', this.chess!)
            piecesInPlay[col][this.currentPosition.row - 1] = child
            this.chess!.add(child)
            this.chess!.exMeter.bar.width = this.chess!.exMeter.bar.width - 300
            this.chess!.exMeter.isOn = false
            this.chess!.exMeter.changeColor()
            for (var moves in this.availableTiles) {
                this.removeChild(this.availableTiles[moves])
            }
            // ugly solution to double selection
            this.reEnablePawns()
        });
        this.addChild(availableMove)
        this.availableTiles.push(availableMove)
    }
    // ugly solution to double selection
    otherPawns: Pawn[] = []
    reEnablePawns () {
        for(var pawn in this.otherPawns) {
            this.otherPawns[pawn].onInitialize()
        }
    }
}