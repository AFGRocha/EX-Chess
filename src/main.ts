import * as ex from 'excalibur';
import Alpine from 'alpinejs'
import { DisplayMode } from 'excalibur';
import { Resources } from "./resources";
import { Chess } from './Scenes/chess';

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

window.Alpine = Alpine

Alpine.store('history', {
  history: [],
  addHistory(newMove: string) {
    //@ts-ignore-line
    this.history.push(newMove);
  },
})

Alpine.start()