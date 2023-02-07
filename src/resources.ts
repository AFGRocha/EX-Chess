import { ImageSource } from "excalibur";
import whitePawn from "./images/white/pawn.png";
import whiteRook from "./images/white/rook.png";
import whiteBishop from "./images/white/bishop.png";
import blackPawn from "./images/black/pawn.png";

let Resources = {
  WhitePawn: new ImageSource(whitePawn),
  WhiteRook: new ImageSource(whiteRook),
  WhiteBishop: new ImageSource(whiteBishop),
  BlackPawn: new ImageSource(blackPawn)
};

export { Resources };