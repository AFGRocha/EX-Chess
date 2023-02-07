import { ImageSource } from "excalibur";
import whitePawn from "./images/white/pawn.png";
import whiteRook from "./images/white/rook.png";
import whiteBishop from "./images/white/bishop.png";
import whiteQueen from "./images/white/queen.png";
import whiteKing from "./images/white/King.png";
import blackPawn from "./images/black/pawn.png";

let Resources = {
  WhitePawn: new ImageSource(whitePawn),
  WhiteRook: new ImageSource(whiteRook),
  WhiteBishop: new ImageSource(whiteBishop),
  WhiteQueen: new ImageSource(whiteQueen),
  WhiteKing: new ImageSource(whiteKing),
  BlackPawn: new ImageSource(blackPawn)
};

export { Resources };