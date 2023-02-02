import { Engine, Loader, Actor } from "excalibur";
import { Board } from "./Models/Board/Board.model";
import { Pawn } from "./Models/Piece/Pawn/Pawn.model";
import { Piece } from "./Models/Piece/Piece.model";
import { Resources } from "./resources";

class Game extends Engine {
    constructor() {
      super({width: 800, height: 800});
    }
    initialize() {
      
      const board = new Board();
      this.add(board);
      console.log(board.tiles)

      const whitePawns = []
      whitePawns.push(new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, {x: board.tiles[0][6].x , y: board.tiles[0][6].y}))
      whitePawns.push(new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, {x: board.tiles[1][6].x , y: board.tiles[1][6].y}))
      whitePawns.push(new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, {x: board.tiles[2][6].x , y: board.tiles[2][6].y}))
      whitePawns.push(new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, {x: board.tiles[3][6].x , y: board.tiles[3][6].y}))
      whitePawns.push(new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, {x: board.tiles[4][6].x , y: board.tiles[4][6].y}))
      whitePawns.push(new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, {x: board.tiles[5][6].x , y: board.tiles[5][6].y}))
      whitePawns.push(new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, {x: board.tiles[6][6].x , y: board.tiles[6][6].y}))
      whitePawns.push(new Pawn(Resources.WhitePawn, {col: 0, row: 6 }, {x: board.tiles[7][6].x , y: board.tiles[7][6].y}))

      for (var pawns in whitePawns) {
        this.add(whitePawns[pawns])
      }

      const loader = new Loader([Resources.WhitePawn]);
      this.start(loader);
      
    }
}
  
export const game = new Game();
game.toggleDebug()
game.initialize();