import * as ex from 'excalibur';
import { smallDistanceMixin } from '../../../Mixins/SmallMovementPiece.mixin';
import { Resources } from '../../../resources';
import { Chess } from '../../../Scenes/chess';
import { piecesInPlay } from '../../../State/Grid.state';
import { AvailableMove } from '../../AvailableMove/AvailableMove.model';
import { TilePosition } from '../../Board/Board.model';
import { Knight } from '../Knight/Knight.model';
import { Pawn } from '../Pawn/Pawn.model';
import { Piece, PiecePosition } from '../Piece.model';
import { Rook } from '../Rook/Rook.model';
import { socket, roomId, player } from '../../../serverConfig';
import { simulateMove } from '../../../Helpers/Simulation/MoveSimulation.helper';

const smallDistancePiece = smallDistanceMixin(Piece)

export class King extends smallDistancePiece {
    directionModifier = [
        {x: 0, y: -1}, // Up
        {x: 0, y: 1}, // Down
        {x: 1, y: 0}, // Right
        {x: -1, y: 0}, // Left
        {x: -1, y: -1}, // UpLeft
        {x: -1, y: 1}, // DownLeft
        {x: 1, y: -1}, // UpRight
        {x: 1, y: 1} // DownRight
    ]
    
    constructor(asset: ex.ImageSource, tilePosition: PiecePosition, grid: TilePosition[][], pieceColor: string, chess: Chess ) { 
        super(asset,tilePosition,grid, pieceColor, `${pieceColor}King${tilePosition.col}`, chess);
        this.exAmount = 300
    }

    onInitialize() {
        super.onInitialize()
    }

    select() {
        if(!this.chess?.exMeter.isOn)
            this.smallDistanceMove(this.directionModifier, piecesInPlay)

        super.select()
    }


    move(x: number, y: number, moveOptions = {isFromServer: false, isServerEx: false }){
        super.move(x, y, moveOptions)
        
        this.castle(x,y)
        
    }
    castle (x: number, y: number) {
        if(y === 7) {
            if(x === 5) { 
                // is there a piece in f1?
                const possibleBlockingPiece = piecesInPlay[6][7]
                const possibleRook = piecesInPlay[7][7]
                if(!possibleBlockingPiece && possibleRook instanceof Rook) {
                    this.move(6,7)
                    possibleRook.move(5,7)
                    
                }
            } else if (x === 3) {
                // is there a piece in c1?
                const possibleBlockingPieceC1 = piecesInPlay[2][7]
                // is there a piece in b1?
                const possibleBlockingPieceB1 = piecesInPlay[1][7]

                const possibleRook = piecesInPlay[0][7]
                    
                if(!possibleBlockingPieceC1 && !possibleBlockingPieceB1 && possibleRook instanceof Rook) {
                    this.move(2,7)
                    possibleRook.move(3,7)
                }
            }
        }
        
    }

    DrawExMove () {
        let allPawns: any = []
        if(this.chess!.exMeter.bar.width >= 300) {
            for (var pieces in piecesInPlay) {
                for(var piece in piecesInPlay[pieces]) {
                    if(piecesInPlay[pieces][piece])
                        if(piecesInPlay[pieces][piece].pieceColor == this.pieceColor && piecesInPlay[pieces][piece] instanceof Pawn)
                            allPawns.push(piecesInPlay[pieces][piece])
                } 
            }

            for (var piece in allPawns) {
                const vectorX = (allPawns[piece].currentPosition.col - this.currentPosition.col) * 100
                const vectorY = (allPawns[piece].currentPosition.row - this.currentPosition.row) * 100
                const vector = new ex.Vector(vectorX, vectorY)
                const availableMove = new AvailableMove(vector, this.availableTileColor)
                const col = allPawns[piece].currentPosition.col
                const row = allPawns[piece].currentPosition.row 
                availableMove.on('pointerdown', () => {
                    this.chess!.remove( piecesInPlay[col][row])
                    const newKnight =  new Knight(((player === 'player1') ? Resources.WhiteKnight : Resources.BlackKnight), {col: col, row: row }, this.chess!.board.tiles, ((player === 'player1') ? 'White' : 'Black'), this.chess!)
                    this.chess!.add(newKnight)
                    piecesInPlay[col][row] = newKnight

                    for (var moves in this.availableTiles) {
                        this.removeChild(this.availableTiles[moves])
                    }
                    this.spendMeter()
                    socket.emit('specific-ex-move', roomId, player, {col: col, row: row}, 'king' )

                })
                this.addChild(availableMove)
                this.availableTiles.push(availableMove)
            }
        }
    }


    getPossibleMoves () {
        return this.availableMoves(this.directionModifier, piecesInPlay)
    }

    check(possibleEnemyMoves: {col: number, row: number}[]) {
        const isCheck = possibleEnemyMoves.find((move: {col: number, row: number}) => move.col === this.currentPosition.col && move.row === this.currentPosition.row)

        return Boolean(isCheck)
    }

    checkmate(possibleMoves: {col: number, row: number, piecePosition: any}[]) {
        for(const move of possibleMoves) {
            const tempBoard = simulateMove(piecesInPlay, move)
            let king = null
            for (var pieces in tempBoard) {
                for(var piece in tempBoard[pieces]) {
                    if(tempBoard[pieces][piece] instanceof King && tempBoard[pieces][piece].pieceColor === this.pieceColor) {
                        king = tempBoard[pieces][piece]
                    } 
                } 
            }

            const enemyColor = this.pieceColor === 'White' ? 'Black' : 'White';
            const enemyPieces = tempBoard.flatMap((innerArray) => 
                innerArray.filter((piece) => {
                    if(piece != null)
                        return piece.pieceColor === enemyColor;
                })
            )


            let possibleEnemyMoves: {col: any; row: any; piecePosition: any;}[] = []
            enemyPieces.forEach(function (piece) {
                possibleEnemyMoves = possibleEnemyMoves.concat(piece.getPossibleMoves())
            }); 
            
            if(!king.check(possibleEnemyMoves))
                return false
        }

        return true
    }
}