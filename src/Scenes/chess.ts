import * as ex from 'excalibur';
import { Board } from '../Models/Board/Board.model';
import { Pawn } from '../Models/Piece/Pawn/Pawn.model';
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
    
        // piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Rook(Resources.WhiteRook, {col: 0, row: 7 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 1, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 2, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 3, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 4, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 5, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 6, row: 6 }, this.board.tiles, 'White', this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 7, row: 6 }, this.board.tiles, 'White', this))
        
        piecesInPlay.push(new Pawn(Resources.BlackPawn, {col: 5, row: 3 }, this.board.tiles, 'Black', this))


        for (var piece in piecesInPlay) {
          this.add(piecesInPlay[piece])
        }
    }
}