import * as ex from 'excalibur';
import { Resources } from '../../../resources';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition } from '../Piece.model';
import { Queen } from '../Queen/Queen.model';


export class Pawn extends Piece {
    firstMove = true  
    killablePieces: Piece[] = []
    enPassantPieces: Piece[] = []

    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}Pawn${tilePosition.col}`, chess);
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        if(this.firstMove) {    
            this.drawMove(0, -200, this.currentPosition.col, this.currentPosition.row - 2)
        }
        
        if(!piecesInPlay[this.currentPosition.col][this.currentPosition.row - 1]) {
            this.drawMove(0, -100, this.currentPosition.col, this.currentPosition.row - 1)
        }
        // this.drawMove(0, -100, this.currentPosition.col, this.currentPosition.row - 1)

        this.getDiagonalPiecesAndDrawMove()
        this.enPassant()

        super.select()
    }

    move(x: number, y: number) {
        super.move(x, y)

        if (this.firstMove){
            this.firstMove = false;
        }

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
}