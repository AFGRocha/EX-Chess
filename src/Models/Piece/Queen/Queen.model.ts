import * as ex from 'excalibur';
import { longDistanceMixin } from '../../../Mixins/LongMovementPiece.mixin';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition } from '../Piece.model';

const LongDistancePiece = longDistanceMixin(Piece)
export class Queen extends LongDistancePiece {
    
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}Rook${tilePosition.col}`, chess);
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        const directionModifier = [
            {x: 0, y: -1}, // Up
            {x: 0, y: 1}, // Down
            {x: 1, y: 0}, // Right
            {x: -1, y: 0}, // Left
            {x: -1, y: -1}, // UpLeft
            {x: -1, y: 1}, // DownLeft
            {x: 1, y: -1}, // UpRight
            {x: 1, y: 1} // DownRight
        ]
        this.longDistanceMove(directionModifier, piecesInPlay)
        super.select()
    }
}