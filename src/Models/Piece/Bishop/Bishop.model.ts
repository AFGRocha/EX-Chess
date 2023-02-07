import * as ex from 'excalibur';
import { longDistanceMixin } from '../../../Mixins/LongMovementPiece.mixin';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition } from '../Piece.model';

const LongDistancePiece = longDistanceMixin(Piece)

export class Bishop extends LongDistancePiece {
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}Bishop${tilePosition.col}`, chess);
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        const directionModifier = [
            {x: -1, y: -1}, // UpLeft
            {x: -1, y: 1}, // DownLeft
            {x: 1, y: -1}, // UpRight
            {x: 1, y: 1} // DownRight
        ]
        this.longDistanceMove(directionModifier, piecesInPlay)
        super.select()
    }
}