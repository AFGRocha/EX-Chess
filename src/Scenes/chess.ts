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
    exMeter = new EX(new ex.Vector(0, 800))
    constructor() {
        super();
    }
    onInitialize(_game: ex.Engine) { 
        this.add(this.board);

        
        piecesInPlay[0][6] = new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, this.board.tiles, 'White', this)
        piecesInPlay[0][7] = new Rook(Resources.WhiteRook, {col: 0, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[1][7] = new Knight(Resources.WhiteKnight, {col: 1, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[2][7] = new Bishop(Resources.WhiteBishop, {col: 2, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[3][7] = new Queen(Resources.WhiteQueen, {col: 3, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[4][7] = new King(Resources.WhiteKing, {col: 4, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[7][7] = new Rook(Resources.WhiteRook, {col: 7, row: 7 }, this.board.tiles, 'White', this)

        piecesInPlay[1][4] = new Pawn(Resources.BlackPawn, {col: 1, row: 4 }, this.board.tiles, 'Black', this)
        piecesInPlay[1][3] = new Pawn(Resources.BlackPawn, {col: 1, row: 3 }, this.board.tiles, 'Black', this)


        for (var pieces in piecesInPlay) {
            for(var piece in piecesInPlay[pieces]) {
                if(piecesInPlay[pieces][piece])
                    this.add(piecesInPlay[pieces][piece])
            }
        }

        this.add(this.exMeter)
    }
}