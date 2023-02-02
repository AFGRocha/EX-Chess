import { Engine, Loader } from "excalibur";
import { Board } from "./Models/Board/Board.model";
import { Resources } from "./resources";

class Game extends Engine {
    constructor() {
      super({width: 800, height: 800});
    }
    initialize() {
      
      const board = new Board();
      this.add(board);

      const loader = new Loader([Resources.Sword]);
      this.start(loader);
    }
  }
  
  export const game = new Game();
  game.initialize();