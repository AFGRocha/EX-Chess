import * as ex from 'excalibur';
import { Resources } from '../../resources';
import { Chess } from '../../Scenes/chess';
import { player, playerColor, roomId, socket, turn } from '../../serverConfig';
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
        this.chess!.exMeter.bar.width += 50
        if(this.chess!.exMeter.bar.width >= 300) {
            this.chess!.exMeter.bar.width = 300
        }

        Resources.KillSound.play()
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

    move(x: number, y: number, isFromServer: boolean = false){
        //@ts-ignore-line
        // window.Alpine.store('history').addHistory(`${this.name} to ${this.getMoveHistory(x,y)}`)
        const $newItem = $('<p>').text(`${this.name} to ${this.getMoveHistory(x,y)}`);
        $gameHistory.append($newItem);
        
        const oldPosition = this.currentPosition
        const newPosition = {col: x, row: y}
        piecesInPlay[this.currentPosition.col][this.currentPosition.row] = null
        piecesInPlay[x][y] = this
        this.pos = new ex.Vector(this.grid[x][y].x + 50, this.grid[x][y].y + 50)
        this.currentPosition = {col: x, row: y}
        for (var moves in this.availableTiles) {
            this.removeChild(this.availableTiles[moves])
        }

        if(isFromServer) {

        } else {
            if(this.chess!.exMeter.isOn) {
                this.spendMeter()
            } else {
                this.chess!.exMeter.bar.width += 10
                if(this.chess!.exMeter.bar.width >= 300) {
                    this.chess!.exMeter.bar.width = 300
                }
            }
        }

        Resources.MoveSound.play()
        
        if(!isFromServer) {
            socket.emit('piece-movement', oldPosition, newPosition, roomId, player)
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
        
        console.log(this.pieceColor)
        if(turn === 1 && this.pieceColor == playerColor) {
            availableMove.on('pointerdown', () => {
                if(killablePiece) {
                    this.killPiece(killablePiece)
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
        Resources.ExSound.play()
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
}