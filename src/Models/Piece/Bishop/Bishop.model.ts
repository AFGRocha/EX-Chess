import * as ex from 'excalibur';
import { Resource } from 'excalibur';
import { longDistanceMixin } from '../../../Mixins/LongMovementPiece.mixin';
import { Resources } from '../../../resources';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { AvailableMove } from '../../AvailableMove/AvailableMove.model';
import { TilePosition } from '../../Board/Board.model';
import { Pawn } from '../Pawn/Pawn.model';
import { Piece, PiecePosition } from '../Piece.model';
import { socket, roomId, player } from '../../../serverConfig';

const LongDistancePiece = longDistanceMixin(Piece)

export class Bishop extends LongDistancePiece {
    directionModifier = [
        {x: -1, y: -1}, // UpLeft
        {x: -1, y: 1}, // DownLeft
        {x: 1, y: -1}, // UpRight
        {x: 1, y: 1} // DownRight
    ]
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}Bishop${tilePosition.col}`, chess);
        this.exAmount = 200
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        if(!this.chess?.exMeter.isOn)
            this.longDistanceMove(this.directionModifier, piecesInPlay)
        super.select()
    }

    DrawExMove () {
        if(this.chess!.exMeter.bar.width >= 200) {
            for(let j = 0; j < this.directionModifier.length; j++) {
                for(let i = 1; i < 8; i++) {
                    const colPosition = this.currentPosition.col + (i * this.directionModifier[j].x)
                    const rowPosition = this.currentPosition.row + (i * this.directionModifier[j].y)
                    if(colPosition < 0 || colPosition > 7 || rowPosition < 0 || rowPosition > 7) {
                        break
                    }
    
                    const moveVectorX = (i * this.directionModifier[j].x) * 100
                    const moveVectorY = (i * this.directionModifier[j].y) * 100
                    const vector = new ex.Vector(moveVectorX, moveVectorY)
                    const blockingPiece = piecesInPlay[colPosition][rowPosition]
                    
                    if(blockingPiece instanceof Pawn) {
                        if(blockingPiece.pieceColor != this.pieceColor) {
                            blockingPiece.off('pointerdown')
                            const availableMove = new AvailableMove(vector, this.availableTileColor)
                            availableMove.on('pointerdown', () => {
                                blockingPiece.pieceColor = this.pieceColor
                                const asset = Resources.WhitePawn
                                blockingPiece.sprite = asset.toSprite()
                                blockingPiece.sprite.width = 100
                                blockingPiece.sprite.height = 100
                                blockingPiece.onInitialize()
                                socket.emit('specific-ex-move', roomId, player, blockingPiece.currentPosition, 'bishop' )
                                for (var moves in this.availableTiles) {
                                    this.removeChild(this.availableTiles[moves])
                                }
                                this.spendMeter()
                            })
    
                            this.addChild(availableMove)
                            this.availableTiles.push(availableMove)
                            break 
                        }
                        break
                    }
                } 
            }
        }
    }

    getPossibleMoves () {
        return this.availableMoves(this.directionModifier, piecesInPlay)
    }
}