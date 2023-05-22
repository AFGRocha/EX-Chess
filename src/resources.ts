import { ImageSource, Sound } from "excalibur";

//images
import whitePawn from "./images/white/pawn.png";
import whiteRook from "./images/white/rook.png";
import whiteKnight from "./images/white/knight.png";
import whiteBishop from "./images/white/bishop.png";
import whiteQueen from "./images/white/queen.png";
import whiteKing from "./images/white/King.png";
import blackPawn from "./images/black/pawn.png";
import blackRook from "./images/black/rook.png";
import blackKnight from "./images/black/knight.png";
import blackBishop from "./images/black/bishop.png";
import blackQueen from "./images/black/queen.png";
import blackKing from "./images/black/King.png";

//sound
import moveSound from "./sound/move-self.mp3"
import killSound from "./sound/capture.mp3"
import exSound from "./sound/ex-placeholder.wav"

//meter
import meter from "./images/Meter/Meter.png";
import meterOn from "./images/Meter/Meter_On.png";

//background
import background from "./images/background/background.png";

let Resources = {
  WhitePawn: new ImageSource(whitePawn),
  WhiteRook: new ImageSource(whiteRook),
  WhiteKnight: new ImageSource(whiteKnight),
  WhiteBishop: new ImageSource(whiteBishop),
  WhiteQueen: new ImageSource(whiteQueen),
  WhiteKing: new ImageSource(whiteKing),
  BlackPawn: new ImageSource(blackPawn),
  BlackRook: new ImageSource(blackRook),
  BlackKnight: new ImageSource(blackKnight),
  BlackBishop: new ImageSource(blackBishop),
  BlackQueen: new ImageSource(blackQueen),
  BlackKing: new ImageSource(blackKing),
  MoveSound: new Sound(moveSound),
  KillSound: new Sound(killSound),
  ExSound: new Sound(exSound),
  Meter: new ImageSource(meter),
  MeterOn: new ImageSource(meterOn),
  Background: new ImageSource(background)
};

export { Resources };