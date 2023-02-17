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
import { socket } from '../serverConfig';
import { piecesInPlay } from '../State/Grid.state';


export class Chess extends ex.Scene {
    board = new Board();
    exMeter = new EX(new ex.Vector(0, 800))
    enemyExMeter = new EX(new ex.Vector(800, 800), true)
    constructor() {
        super();
    }
    onInitialize(_game: ex.Engine) { 
        this.add(this.board);
        this.enemyExMeter.scale = new ex.Vector(-1,1)

        this.renderWhiteSideView()

        for (var pieces in piecesInPlay) {
            for(var piece in piecesInPlay[pieces]) {
                if(piecesInPlay[pieces][piece])
                    this.add(piecesInPlay[pieces][piece])
            }
        }

        this.add(this.exMeter)
        this.add(this.enemyExMeter)
        socket.on('piece-movement', (oldPosition: any, newPosition: any) => {
            piecesInPlay[oldPosition.col][oldPosition.row].move(newPosition.col, newPosition.row, true)
        })
    }


    renderWhiteSideView() {
        //White
        piecesInPlay[0][6] = new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, this.board.tiles, 'White', this)
        piecesInPlay[1][6] = new Pawn(Resources.WhitePawn, {col: 1, row: 6 }, this.board.tiles, 'White', this)
        piecesInPlay[2][6] = new Pawn(Resources.WhitePawn, {col: 2, row: 6 }, this.board.tiles, 'White', this)
        piecesInPlay[3][6] = new Pawn(Resources.WhitePawn, {col: 3, row: 6 }, this.board.tiles, 'White', this)
        piecesInPlay[4][6] = new Pawn(Resources.WhitePawn, {col: 4, row: 6 }, this.board.tiles, 'White', this)
        piecesInPlay[5][6] = new Pawn(Resources.WhitePawn, {col: 5, row: 6 }, this.board.tiles, 'White', this)
        piecesInPlay[6][6] = new Pawn(Resources.WhitePawn, {col: 6, row: 6 }, this.board.tiles, 'White', this)
        piecesInPlay[7][6] = new Pawn(Resources.WhitePawn, {col: 7, row: 6 }, this.board.tiles, 'White', this)

        piecesInPlay[0][7] = new Rook(Resources.WhiteRook, {col: 0, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[1][7] = new Knight(Resources.WhiteKnight, {col: 1, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[2][7] = new Bishop(Resources.WhiteBishop, {col: 2, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[3][7] = new Queen(Resources.WhiteQueen, {col: 3, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[4][7] = new King(Resources.WhiteKing, {col: 4, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[5][7] = new Bishop(Resources.WhiteBishop, {col: 5, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[6][7] = new Knight(Resources.WhiteKnight, {col: 6, row: 7 }, this.board.tiles, 'White', this)
        piecesInPlay[7][7] = new Rook(Resources.WhiteRook, {col: 7, row: 7 }, this.board.tiles, 'White', this)

        //Black
        piecesInPlay[0][1] = new Pawn(Resources.BlackPawn, {col: 0, row: 1 }, this.board.tiles, 'Black', this)
        piecesInPlay[1][1] = new Pawn(Resources.BlackPawn, {col: 1, row: 1 }, this.board.tiles, 'Black', this)
        piecesInPlay[2][1] = new Pawn(Resources.BlackPawn, {col: 2, row: 1 }, this.board.tiles, 'Black', this)
        piecesInPlay[3][1] = new Pawn(Resources.BlackPawn, {col: 3, row: 1 }, this.board.tiles, 'Black', this)
        piecesInPlay[4][1] = new Pawn(Resources.BlackPawn, {col: 4, row: 1 }, this.board.tiles, 'Black', this)
        piecesInPlay[5][1] = new Pawn(Resources.BlackPawn, {col: 5, row: 1 }, this.board.tiles, 'Black', this)
        piecesInPlay[6][1] = new Pawn(Resources.BlackPawn, {col: 6, row: 1 }, this.board.tiles, 'Black', this)
        piecesInPlay[7][1] = new Pawn(Resources.BlackPawn, {col: 7, row: 1 }, this.board.tiles, 'Black', this)

        piecesInPlay[0][0] = new Rook(Resources.BlackRook, {col: 0, row: 0 }, this.board.tiles, 'White', this)
        piecesInPlay[1][0] = new Knight(Resources.BlackKnight, {col: 1, row: 0 }, this.board.tiles, 'White', this)
        piecesInPlay[2][0] = new Bishop(Resources.BlackBishop, {col: 2, row: 0 }, this.board.tiles, 'White', this)
        piecesInPlay[3][0] = new King(Resources.BlackKing, {col: 3, row: 0 }, this.board.tiles, 'White', this)
        piecesInPlay[4][0] = new Queen(Resources.BlackQueen, {col: 4, row: 0 }, this.board.tiles, 'White', this)
        piecesInPlay[5][0] = new Bishop(Resources.BlackBishop, {col: 5, row: 0 }, this.board.tiles, 'White', this)
        piecesInPlay[6][0] = new Knight(Resources.BlackKnight, {col: 6, row: 0 }, this.board.tiles, 'White', this)
        piecesInPlay[7][0] = new Rook(Resources.BlackRook, {col: 7, row: 0 }, this.board.tiles, 'White', this)
    }
}