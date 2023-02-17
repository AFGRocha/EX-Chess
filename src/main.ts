import * as ex from 'excalibur';
import { DisplayMode } from 'excalibur';
import { Resources } from "./resources";
import { Chess } from './Scenes/chess';
import { connectToRoom } from './serverConfig';


class Game extends ex.Engine {
  constructor() {
    super({
      // set the viewport dimensions
      viewport: { width: 800, height: 900 },
    
      // sets the resolution
      resolution: { width: 800, height: 900 }
    });
  }
  initialize() {

  // Build and load resources
  var loader = new ex.Loader();
  loader.suppressPlayButton = true;
  (Object.keys(Resources) as (keyof typeof Resources)[]).forEach((key) => {
    loader.addResource(Resources[key]);
  });
  this.start(loader);
      
  }
}
  
export const chess = new Chess()
export const game = new Game();
game.toggleDebug()
game.initialize();
game.add('chess', chess)
game.goToScene('chess')


connectToRoom()