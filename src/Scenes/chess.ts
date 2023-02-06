import * as ex from 'excalibur';
import { Board } from '../Models/Board/Board.model';
import { Pawn } from '../Models/Piece/Pawn/Pawn.model';
import { Resources } from '../resources';
import { piecesInPlay } from '../State/Grid.state';


export class Chess extends ex.Scene {
    constructor() {
        super();
    }
    onInitialize(_game: ex.Engine) { 
        const board = new Board();
        this.add(board);
        console.log(board.tiles)
  
    
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, board.tiles, this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 1, row: 6 }, board.tiles, this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 2, row: 6 }, board.tiles, this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 3, row: 6 }, board.tiles, this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 4, row: 6 }, board.tiles, this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 5, row: 6 }, board.tiles, this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 6, row: 6 }, board.tiles, this))
        piecesInPlay.push(new Pawn(Resources.WhitePawn, {col: 7, row: 6 }, board.tiles, this))
        
        piecesInPlay.push(new Pawn(Resources.BlackPawn, {col: 5, row: 3 }, board.tiles, this))


        for (var piece in piecesInPlay) {
          this.add(piecesInPlay[piece])
        }
    }
}