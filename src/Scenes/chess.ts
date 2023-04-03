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
import { player, socket } from '../serverConfig';
import { piecesInPlay } from '../State/Grid.state';


export class Chess extends ex.Scene {
    board = new Board();
    exMeter = new EX(new ex.Vector(0, 800))
    enemyExMeter = new EX(new ex.Vector(800, 800), true)
    whiteSidePawns = 6
    whiteSideBigPieces = 7
    blackSidePawns = 1
    blackSideBigPieces = 0
    constructor() {
        super();
    }
    onInitialize(_game: ex.Engine) { 
        this.add(this.board);
        this.enemyExMeter.scale = new ex.Vector(-1,1)

        // this.renderView()

        for (var pieces in piecesInPlay) {
            for(var piece in piecesInPlay[pieces]) {
                if(piecesInPlay[pieces][piece])
                    this.add(piecesInPlay[pieces][piece])
            }
        }

        this.add(this.exMeter)
        this.add(this.enemyExMeter)
    }

    
    renderView() {
        if(player === 'player2') {
            this.whiteSidePawns = 1
            this.whiteSideBigPieces = 0
            this.blackSidePawns = 6
            this.blackSideBigPieces = 7
        }
        //White
        piecesInPlay[0][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 0, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[1][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 1, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[2][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 2, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[3][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 3, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[4][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 4, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[5][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 5, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[6][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 6, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[7][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 7, row: this.whiteSidePawns }, this.board.tiles, 'White', this)

        piecesInPlay[0][this.whiteSideBigPieces] = new Rook(Resources.WhiteRook, {col: 0, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[1][this.whiteSideBigPieces] = new Knight(Resources.WhiteKnight, {col: 1, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[2][this.whiteSideBigPieces] = new Bishop(Resources.WhiteBishop, {col: 2, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[3][this.whiteSideBigPieces] = new Queen(Resources.WhiteQueen, {col: 3, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[4][this.whiteSideBigPieces] = new King(Resources.WhiteKing, {col: 4, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[5][this.whiteSideBigPieces] = new Bishop(Resources.WhiteBishop, {col: 5, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[6][this.whiteSideBigPieces] = new Knight(Resources.WhiteKnight, {col: 6, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[7][this.whiteSideBigPieces] = new Rook(Resources.WhiteRook, {col: 7, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)

        //Black
        piecesInPlay[0][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 0, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[1][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 1, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[2][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 2, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[3][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 3, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[4][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 4, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[5][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 5, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[6][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 6, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[7][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 7, row: this.blackSidePawns }, this.board.tiles, 'Black', this)

        piecesInPlay[0][this.blackSideBigPieces] = new Rook(Resources.BlackRook, {col: 0, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[1][this.blackSideBigPieces] = new Knight(Resources.BlackKnight, {col: 1, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[2][this.blackSideBigPieces] = new Bishop(Resources.BlackBishop, {col: 2, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[3][this.blackSideBigPieces] = new King(Resources.BlackKing, {col: 3, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[4][this.blackSideBigPieces] = new Queen(Resources.BlackQueen, {col: 4, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[5][this.blackSideBigPieces] = new Bishop(Resources.BlackBishop, {col: 5, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[6][this.blackSideBigPieces] = new Knight(Resources.BlackKnight, {col: 6, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[7][this.blackSideBigPieces] = new Rook(Resources.BlackRook, {col: 7, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
    }

}