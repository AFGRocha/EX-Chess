import * as ex from 'excalibur';
import { Resources, Audio } from "./resources";
import { Chess } from './Scenes/chess';
import { connectToRoom, fullRoom, socket, waitForEvent } from './serverConfig';
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
  loader.backgroundColor = "#312E2B"
  loader.logo = "/src/images/logo.png"
  loader.suppressPlayButton = true;
  (Object.keys(Resources) as (keyof typeof Resources)[]).forEach((key) => {
    Resources[key].load()
    loader.addResource(Resources[key]);
  });

  (Object.keys(Audio) as (keyof typeof Audio)[]).forEach((key) => {
    loader.addResource(Audio[key]);
  });
  this.start(loader);
  
  }
}
  
export const chess = new Chess();
export const game = new Game();
let roomId = ''

function showGame () {
    chess.renderView()
    //game.toggleDebug()
    game.initialize();
    game.add('chess', chess)
    game.goToScene('chess')
}

function showRoomInfo () {
  $("#info-container").show()
  $("#create-game").hide()
  $('#roomId').text("Room Id: " + roomId);
}

function startGame () {
  $("#create").on("click",function(e) {
    e.preventDefault();

    roomId = (Math.random() + 1).toString(36).substring(7);
    connectToRoom(roomId, 'player1')
    showRoomInfo()
    $("#waiting").show()
    Promise.race([
      waitForEvent(socket, 'player2-ready')
    ]).then(() => {
        showGame()
        $("#waiting").hide()
    })
  });

  $("#join").on("click",function(e) {
    e.preventDefault();
    roomId = $("#room-code").val() as string
    connectToRoom(roomId, 'player2')
    Promise.race([
      waitForEvent(socket, 'connected'),
      waitForEvent(socket, 'full-room')
    ])
      .then(() => {
        if(fullRoom)
        $("#room-full").show()
        else {
          showRoomInfo()
          showGame()
        }
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  });
  
  $("#history-button").on("click",function(e) { 
    e.preventDefault();
    $("#history").show()
    $("#history-button").removeClass('inactive-tab').addClass('active-tab')
    $("#exs-button").removeClass('active-tab').addClass('inactive-tab')
    $("#exs").hide()
  });

  $("#exs-button").on("click",function(e) { 
    e.preventDefault();
    $("#exs").show()
    $("#exs-button").removeClass('inactive-tab').addClass('active-tab')
    $("#history-button").removeClass('active-tab').addClass('inactive-tab')
    $("#history").hide()
  });
}

startGame()
