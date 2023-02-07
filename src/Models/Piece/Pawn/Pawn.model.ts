import * as ex from 'excalibur';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { AvailableMove } from '../../AvailableMove/AvailableMove.model';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition } from '../Piece.model';


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
        if(!piecesInPlay.find(piece => JSON.stringify(piece.currentPosition) === JSON.stringify({col: this.currentPosition.col, row: this.currentPosition.row - 1}))) {
            this.drawMove(0, -100, this.currentPosition.col, this.currentPosition.row - 1)
        }
        // this.drawMove(0, -100, this.currentPosition.col, this.currentPosition.row - 1)

        this.getDiagonalPiecesAndDrawMove()
        this.enPassant()

        this.cancel(this)
    }

    move(x: number, y: number) {
        super.move(x, y)

        if (this.firstMove){
            this.firstMove = false;
        }
    }

    drawMove (vectorX: number, vectorY: number, moveX: number, moveY: number, killablePiece: Piece | null = null) {
        const movePosition = new ex.Vector(vectorX, vectorY)
        const availableMove = new AvailableMove(movePosition, this.availableTileColor)
        
        availableMove.on('pointerdown', () => {
            this.move(moveX,moveY)
            if(killablePiece) {
                this.killPiece(killablePiece)
            }
        });
        this.addChild(availableMove)
        this.availableTiles.push(availableMove)
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
        this.killablePieces = []
    }

    enPassant() {
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
    }
}