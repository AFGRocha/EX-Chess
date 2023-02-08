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
    canEnPassant: boolean = false;

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
        if(!piecesInPlay.find(piece => JSON.stringify(piece.currentPosition) === JSON.stringify({col: this.currentPosition.col, row: this.currentPosition.row - 1}))) {
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
        this.killablePieces.push(piecesInPlay.find(piece => JSON.stringify(piece.currentPosition) === JSON.stringify({col: this.currentPosition.col + 1, row: this.currentPosition.row - 1}))!)
        this.killablePieces.push(piecesInPlay.find(piece => JSON.stringify(piece.currentPosition) === JSON.stringify({col: this.currentPosition.col - 1, row: this.currentPosition.row - 1}))!)


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
        if(!this.killablePieces.length) {
            this.canEnPassant = true
        }
        this.killablePieces = []
    }

    enPassant() {
        if(this.currentPosition.row === 3 && this.canEnPassant) {
            this.enPassantPieces.push(piecesInPlay.find(piece => JSON.stringify(piece.currentPosition) === JSON.stringify({col: this.currentPosition.col + 1, row: this.currentPosition.row}))!)
            this.enPassantPieces.push(piecesInPlay.find(piece => JSON.stringify(piece.currentPosition) === JSON.stringify({col: this.currentPosition.col - 1, row: this.currentPosition.row}))!)
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
            this.canEnPassant = false
        }
    }

    promote (col: number) {
        const index = piecesInPlay.indexOf(this)
        this.chess!.remove(piecesInPlay[index])
        piecesInPlay.splice(index, 1)
        const newQueen = new Queen(Resources.WhiteQueen, {col: col, row: 0 }, this.grid, 'White', this.chess!)
        piecesInPlay.push(newQueen)
        this.chess?.add(newQueen)

        // Easter Egg
        console.log('yas queen slay')
    }
}