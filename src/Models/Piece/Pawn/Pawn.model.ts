import * as ex from 'excalibur';
import { ImageSource } from 'excalibur';
import { Piece, PiecePosition, PixelPosition } from '../Piece.model';


export class Pawn extends Piece {    
    constructor(asset: ImageSource, tilePosition: PiecePosition, pixelPosition: PixelPosition ) { 
        super(asset,tilePosition,pixelPosition);
    }
}