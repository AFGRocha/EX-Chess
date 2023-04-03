import * as ex from 'excalibur';
import { DisplayMode } from 'excalibur';
import { Resources } from "./resources";
import { Chess } from './Scenes/chess';
import { connectToRoom } from './serverConfig';
import $ from "jquery";



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
  
export const chess = new Chess();
export const game = new Game();
let roomId = ''

function startGame () {
  $("#create").on("click",function(e) {
    e.preventDefault();
    $("#history").show()
    $("#create-game").hide()
    roomId = (Math.random() + 1).toString(36).substring(7);
    $('#roomId').text("Room Id: " + roomId);
    connectToRoom(roomId, 'player1')

    chess.renderView()
    game.toggleDebug()
    game.initialize();
    game.add('chess', chess)
    game.goToScene('chess')
  });

  $("#join").on("click",function(e) {
    e.preventDefault();
    $('#roomId').text("Room Id: " + $("#room-code").val());
    $("#history").show()
    $("#create-game").hide()
    roomId = $("#room-code").val() as string
    connectToRoom(roomId, 'player2')

    chess.renderView()
    game.toggleDebug()
    game.initialize();
    game.add('chess', chess)
    game.goToScene('chess')
  });
  
}

startGame()