import { ImageSource } from "excalibur";
import whitePawn from "./images/white/pawn.png";
import blackPawn from "./images/black/pawn.png";

let Resources = {
  WhitePawn: new ImageSource(whitePawn),
  BlackPawn: new ImageSource(blackPawn)
};

export { Resources };