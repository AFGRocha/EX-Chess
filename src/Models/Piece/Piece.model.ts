import * as ex from 'excalibur';
import { Audio } from '../../resources';
import { Chess } from '../../Scenes/chess';
import { getIsCheck, getKing, kingCheck, nextTurn, player, playerColor, roomId, socket, turn } from '../../serverConfig';
import { piecesInPlay } from '../../State/Grid.state';
import { AvailableMove } from '../AvailableMove/AvailableMove.model';
import { TilePosition } from '../Board/Board.model';
import $ from "jquery";
import { $gameHistory } from '../../State/History.state';



export interface PiecePosition {
    col: number,
    row: number
}

export interface PixelPosition {
    x: number,
    y: number
}

enum EnumColNames {
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H
}

export class Piece extends ex.Actor {
    killed = false;
    currentPosition: PiecePosition
    white = true;
    sprite: ex.Sprite
    availableTileColor = new ex.Color(255, 0, 0, 0.5)
    nonTurnAvailableTileColor = new ex.Color(128, 128, 128, 0.5)
    availableTiles: AvailableMove[] = []
    chess: Chess | null = null
    isSelected: boolean = false
    pieceColor: string = ''
    exAmount: number = 0
    grid
    
    constructor(asset: ex.ImageSource, position: PiecePosition, grid: TilePosition[][], pieceColor: string, name: string, chess: Chess ) { 
        super({
            pos: ex.vec(grid[position.col][position.row].x + 50, grid[position.col][position.row].y + 50),
            width: 100,
            height: 100,
            name: name
          });
          this.sprite = asset.toSprite()
          this.sprite.width = 100
          this.sprite.height = 100
          this.currentPosition = position
          this.grid = grid
          this.chess = chess
          this.pieceColor = pieceColor
    }

    onInitialize() {
        this.graphics.add(this.sprite);
        this.on('pointerdown', () => {
            this.cleanAvailableTiles
            this.select()
        });
    }

    killPiece(killedPiece: Piece) {
        if(killedPiece.pieceColor != this.pieceColor) {
            this.chess!.remove(piecesInPlay[killedPiece.currentPosition.col][killedPiece.currentPosition.row])
            piecesInPlay[killedPiece.currentPosition.col][killedPiece.currentPosition.row] = null
        }
        this.chess!.exMeter.addMeter(50)
      
        Audio.KillSound.play()
    }

    cleanAvailableTiles () {
        for (var moves in this.availableTiles) {
            this.removeChild(this.availableTiles[moves])
        }
    }

    select(){
        if(this.chess?.exMeter.isOn) {
            this.DrawExMove()
        }
        this.cancel(this)
    }

    move(x: number, y: number, moveOptions = {isFromServer: false, isServerEx: false } ){
        const $newItem = $('<p>').text(`${this.pieceColor}: ${this.getMoveHistory(this.currentPosition.col,this.currentPosition.row)} to ${this.getMoveHistory(x,y)}`);
        $gameHistory.append($newItem);
        
        const oldPosition = this.currentPosition
        const newPosition = {col: x, row: y}
        const isEx = this.chess!.exMeter.isOn
        piecesInPlay[this.currentPosition.col][this.currentPosition.row] = null
        piecesInPlay[x][y] = this
        this.currentPosition = {col: x, row: y}
        
        function finishMove(piece: Piece) {
            piece.pos = new ex.Vector(piece.grid[x][y].x + 50, piece.grid[x][y].y + 50)

            for (var moves in piece.availableTiles) {
                piece.removeChild(piece.availableTiles[moves])
            }
    
            if(moveOptions.isFromServer) {
                if(!moveOptions.isServerEx) {
                    piece.chess!.enemyExMeter.addMeter(50)
                }
            } else {
                if(piece.chess!.exMeter.isOn) {
                    piece.spendMeter()
                } else {
                    piece.chess!.exMeter.addMeter(50)
                    nextTurn(player)
                }
            }
    
            Audio.MoveSound.play()
            
            if(!moveOptions.isFromServer) {
                socket.emit('piece-movement', oldPosition, newPosition, roomId, player, isEx.toString())
            }
        }

        if(getIsCheck()) {
            const myKing = getKing()
            kingCheck(myKing.king!, myKing.enemy)

            if(getIsCheck()) {
                this.currentPosition = {col: oldPosition.col, row: oldPosition.row}
                piecesInPlay[x][y] = null
                piecesInPlay[this.currentPosition.col][this.currentPosition.row] = this
            } else {
                finishMove(this)
            }
        } else {
            finishMove(this)
        }
           
    }

    cancel(piece: Piece) {
        this.chess!.board.on('pointerdown', () => {
            for (var moves in piece.availableTiles) {
                this.removeChild(piece.availableTiles[moves])
            }
            this.chess!.board.off("pointerdown");
            piece.availableTiles = []
        });

        this.chess!.exMeter.on('pointerdown', () => {
            for (var moves in piece.availableTiles) {
                this.removeChild(piece.availableTiles[moves])
            }
            piece.availableTiles = []
        });
    }

    drawMove (vectorX: number, vectorY: number, moveX: number, moveY: number, killablePiece: Piece |  null = null) {
        const color = (turn === 1 && this.pieceColor == playerColor ? this.availableTileColor : this.nonTurnAvailableTileColor);
        const movePosition = new ex.Vector(vectorX, vectorY)
        const availableMove = new AvailableMove(movePosition, color)
        
        if(turn === 1 && this.pieceColor == playerColor) {
            availableMove.on('pointerdown', () => {
                if(killablePiece) {
                    this.killPiece(killablePiece)
                    this.emitKill(killablePiece)
                }
                this.move(moveX,moveY)
            });
        }

        if(this.pieceColor == playerColor)
            this.addChild(availableMove)
        this.availableTiles.push(availableMove)
    }

    DrawExMove() {

    }

    spendMeter () {
        this.chess!.exMeter.bar.width = this.chess!.exMeter.bar.width - this.exAmount
        this.chess!.exMeter.isOn = false
        this.chess!.exMeter.changeColor()
        Audio.ExSound.play()
        socket.emit('ex-spend-meter', roomId, player, this.exAmount)
        nextTurn(player)
    }

    emitKill (killedPiece: Piece) {
        socket.emit('kill', roomId, player, killedPiece.currentPosition)
    }

    getMoveHistory (x: number, y: number) {
        let string = EnumColNames[x]
        if(this.pieceColor === 'White') {
            string += Math.abs(y - 8)
        } else {
            string += y + 1
        }

        return string
    }

    getPossibleMoves () {

    }

    removeSelf() {
        this.chess!.remove(this)
    }
}