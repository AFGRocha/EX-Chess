import * as ex from 'excalibur';
import { Board } from '../Models/Board/Board.model';
import { EX } from '../Models/EX/EX.model';
import { Bishop } from '../Models/Piece/Bishop/Bishop.model';
import { King } from '../Models/Piece/King/King.model';
import { Knight } from '../Models/Piece/Knight/Knight.model';
import { Pawn } from '../Models/Piece/Pawn/Pawn.model';
import { Queen } from '../Models/Piece/Queen/Queen.model';
import { Rook } from '../Models/Piece/Rook/Rook.model';
import { Resources } from '../resources';
import { piecesInPlay } from '../State/Grid.state';


export class Chess extends ex.Scene {
    board = new Board();
    constructor() {
        super();
    }
    onInitialize(_game: ex.Engine) { 
        this.add(this.board);

        this.add(new EX(new ex.Vector(0, 800)))
        console.log(piecesInPlay)
        piecesInPlay[0][6] = new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, this.board.tiles, 'White', this)
        piecesInPlay[0][7] = new Rook(Resources.WhiteRook, {col: 0, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[2][7] = new Bishop(Resources.WhiteBishop, {col: 2, row: 7 }, this.board.tiles, 'White', this)
        /*piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Rook(Resources.WhiteRook, {col: 0, row: 7 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Knight(Resources.WhiteKnight, {col: 1, row: 7 }, this.board.tiles, 'White', this))

        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 1, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 2, row: 6 }, this.board.tiles, 'White', this))
        
        piecesInPlay.push(new Bishop(Resources.WhiteBishop, {col: 2, row: 7 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Queen(Resources.WhiteQueen, {col: 3, row: 7 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new King(Resources.WhiteKing, {col: 4, row: 7 }, this.board.tiles, 'White', this))

        piecesInPlay.push(new Rook(Resources.WhiteRook, {col: 7, row: 7 }, this.board.tiles, 'White', this))


        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 3, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 4, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 5, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 6, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 7, row: 6 }, this.board.tiles, 'White', this))
        
        piecesInPlay.push(new Pawn(Resources.BlackPawn, {col: 5, row: 2 }, this.board.tiles, 'Black', this)) */
        piecesInPlay[1][4] = new Pawn(Resources.BlackPawn, {col: 1, row: 4 }, this.board.tiles, 'Black', this)
        piecesInPlay[1][3] = new Pawn(Resources.BlackPawn, {col: 1, row: 3 }, this.board.tiles, 'Black', this)


        for (var pieces in piecesInPlay) {
            for(var piece in piecesInPlay[pieces]) {
                if(piecesInPlay[pieces][piece])
                    this.add(piecesInPlay[pieces][piece])
            }
        }
    }
}