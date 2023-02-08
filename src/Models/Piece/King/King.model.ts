import * as ex from 'excalibur';
import { smallDistanceMixin } from '../../../Mixins/SmallMovementPiece.mixin';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { TilePosition } from '../../Board/Board.model';
import { Piece, PiecePosition } from '../Piece.model';
import { Rook } from '../Rook/Rook.model';

const smallDistancePiece = smallDistanceMixin(Piece)

export class King extends smallDistancePiece {
    
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}King${tilePosition.col}`, chess);
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

        this.smallDistanceMove(directionModifier, piecesInPlay)
        
        super.select()
    }


    move(x: number, y: number){
        super.move(x, y)
        
        this.castle(x,y)
        
    }
    castle (x: number, y: number) {
        if(y === 7) {
            if(x === 5) { 
                // is there a piece in f1?
                const possibleBlockingPiece = piecesInPlay.find(piece => 
                    JSON.stringify(piece.currentPosition) === 
                    JSON.stringify({col: 6, row: 7}))

                console.log(possibleBlockingPiece)
                if(!possibleBlockingPiece) {
                    console.log('not blocked') 
                    const possibleRook = piecesInPlay.find(piece => 
                        JSON.stringify(piece.currentPosition) === 
                        JSON.stringify({col: 7, row: 7}))
                    if (possibleRook instanceof Rook){
                        possibleRook.move(5,7)
                        this.move(6,7)
                    }
                }
            } else if (x === 3) {
                // is there a piece in c1?
                const possibleBlockingPieceC1 = piecesInPlay.find(piece => 
                    JSON.stringify(piece.currentPosition) === 
                    JSON.stringify({col: 2, row: 7}))
                // is there a piece in b1?
                const possibleBlockingPieceB1 = piecesInPlay.find(piece => 
                    JSON.stringify(piece.currentPosition) === 
                    JSON.stringify({col: 1, row: 7}))
                    
                if(!possibleBlockingPieceC1 && !possibleBlockingPieceB1) {
                    const possibleRook = piecesInPlay.find(piece => 
                        JSON.stringify(piece.currentPosition) === 
                        JSON.stringify({col: 0, row: 7}))
                    if (possibleRook instanceof Rook){
                        possibleRook.move(3,7)
                        this.move(2,7)
                    }
                }
            }
        }
        
    }
}