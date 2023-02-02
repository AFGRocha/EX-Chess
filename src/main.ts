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

      const pawn = new Pawn(Resources.WhitePawn, {col: 0, row: 0 }, {x: 0, y: 0 });
      this.add(pawn)

      const loader = new Loader([Resources.WhitePawn]);
      this.start(loader);
      
    }
}
  
export const game = new Game();
game.toggleDebug()
game.initialize();