import * as ex from 'excalibur';
import { Resources } from "./resources";
import { Chess } from './Scenes/chess';

class Game extends ex.Engine {
    constructor() {
      super({width: 800, height: 800});
    }
    initialize() {

      const loader = new ex.Loader([Resources.WhitePawn, Resources.BlackPawn]);
      this.start(loader);
      
    }
}
  
export const chess = new Chess()
export const game = new Game();
game.toggleDebug()
game.initialize();
game.add('chess', chess)
game.goToScene('chess')