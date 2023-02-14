import * as ex from 'excalibur';
import { smallDistanceMixin } from '../../../Mixins/SmallMovementPiece.mixin';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { AvailableMove } from '../../AvailableMove/AvailableMove.model';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition } from '../Piece.model';

const smallDistancePiece = smallDistanceMixin(Piece)

export class Knight extends smallDistancePiece {
    directionModifier = [
        {x: -1, y: -2}, // UpLeft
        {x: -2, y: -1}, // LeftUp
        {x: -1, y: 2}, // DownLeft
        {x: -2, y: 1}, // LeftDown
        {x: 1, y: -2}, // UpRight
        {x: 2, y: -1}, // RightUp
        {x: 2, y: 1}, // RightDown
        {x: 1, y: 2} // DownRight
    ]
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}Knigh${tilePosition.col}`, chess);
        this.exAmount = 200
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        if(!this.chess?.exMeter.isOn)
            this.smallDistanceMove(this.directionModifier, piecesInPlay)

        super.select()
    }

    DrawExMove() {
        if(this.chess!.exMeter.bar.width >= 200) {
            for (var col in piecesInPlay) {
                for(var row in piecesInPlay[col]) {
                    if(!piecesInPlay[col][row]) {
                        const x = parseInt(col)
                        const y = parseInt(row)
                        const vectorX = (x - this.currentPosition.col) * 100
                        const vectorY = (y - this.currentPosition.row) * 100
                        const vector = new ex.Vector(vectorX, vectorY)
                        const availableMove = new AvailableMove(vector, this.availableTileColor)
                        availableMove.on('pointerdown', () => {
                            this.move(x, y)
                            console.log(piecesInPlay)
                        })
                        this.addChild(availableMove)
                        this.availableTiles.push(availableMove)
                    } 
                } 
            }
        }
    }
}