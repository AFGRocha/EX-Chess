import * as ex from 'excalibur';
import { smallDistanceMixin } from '../../../Mixins/SmallMovementPiece.mixin';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition } from '../Piece.model';

const smallDistancePiece = smallDistanceMixin(Piece)

export class Knight extends smallDistancePiece {
    
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}Knigh${tilePosition.col}`, chess);
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        const directionModifier = [
            {x: -1, y: -2}, // UpLeft
            {x: -2, y: -1}, // LeftUp
            {x: -1, y: 2}, // DownLeft
            {x: -2, y: 1}, // LeftDown
            {x: 1, y: -2}, // UpRight
            {x: 2, y: -1}, // RightUp
            {x: 2, y: 1}, // RightDown
            {x: 1, y: 2} // DownRight
        ]

        this.smallDistanceMove(directionModifier, piecesInPlay)

        super.select()
    }
}