import * as ex from 'excalibur';
import { Board } from '../Models/Board/Board.model';
import { EX } from '../Models/EX/EX.model';
import { Bishop } from '../Models/Piece/Bishop/Bishop.model';
import { King } from '../Models/Piece/King/King.model';
import { Knight } from '../Models/Piece/Knight/Knight.model';
import { Pawn } from '../Models/Piece/Pawn/Pawn.model';
import { Queen } from '../Models/Piece/Queen/Queen.model';
import { Rook } from '../Models/Piece/Rook/Rook.model';
import { Resources } from '../resources';
import { endGame, invert, nextTurn, player, setKings, socket } from '../serverConfig';
import { piecesInPlay } from '../State/Grid.state';
import { KingStateAnimation } from '../Models/KingStateAnimation/KingStateAnimation.model';
import $ from "jquery";


export class Chess extends ex.Scene {
    board = new Board();
    exMeter = new EX(new ex.Vector(0, 800), false, Resources.Meter, Resources.MeterOn)
    enemyExMeter = new EX(new ex.Vector(800, 800), true, Resources.Meter, Resources.MeterOn)
    whiteSidePawns = 6
    whiteSideBigPieces = 7
    blackSidePawns = 1
    blackSideBigPieces = 0
    background = new ex.Actor({anchor: ex.vec(0, 0)})
    checkAnimation = new KingStateAnimation(Resources.Check)
    checkmateAnimation = new KingStateAnimation(Resources.Checkmate)

    constructor() {
        super();
    }
    onInitialize(_game: ex.Engine) { 
        this.background.graphics.use(Resources.Background.toSprite())
        this.add(this.background)
        this.add(this.board);
        this.exMeter.scale = new ex.Vector(0.95,0.95)
        this.enemyExMeter.scale = new ex.Vector(-0.95,0.95)

        // this.renderView()

        for (var pieces in piecesInPlay) {
            for(var piece in piecesInPlay[pieces]) {
                if(piecesInPlay[pieces][piece])
                    this.add(piecesInPlay[pieces][piece])
            }
        }

        this.add(this.exMeter)
        this.add(this.enemyExMeter)
        this.add(this.checkAnimation)
        this.add(this.checkmateAnimation)

        socket.on('ex-press-server', (isOn: string, whichPlayer: string) => {
            if(whichPlayer != player) {
                this.enemyExMeter.isOn = (isOn === 'true');
                this.enemyExMeter.changeColor()   
            }
        })

        socket.on('ex-spend-meter-server', (whichPlayer: string, ammount: number) => {
            if(whichPlayer != player) {
                this.enemyExMeter.bar.width = ( this.enemyExMeter.bar.width - ammount )
                this.enemyExMeter.isOn = false
                this.enemyExMeter.changeColor()
            }
        })

        socket.on('kill-piece-from-server', (whichPlayer: string, killablePiece: {col: number, row: number}) => {
            if(whichPlayer !== player) {
                this.remove(piecesInPlay[invert(killablePiece.col)][invert(killablePiece.row)])
                piecesInPlay[invert(killablePiece.col)][invert(killablePiece.row)] = null
                this.enemyExMeter.addMeter(50)
            }
        })

        socket.on('ex-move-from-server', (whichPlayer: string, blockingPiecePosition: {col: number, row: number}, piece: string) => {
            if(whichPlayer !== player) {
                switch (piece) {
                    case 'bishop':
                        piecesInPlay[invert(blockingPiecePosition.col)][invert(blockingPiecePosition.row)].pieceColor = ((piecesInPlay[invert(blockingPiecePosition.col)][invert(blockingPiecePosition.row)].pieceColor === 'White') ? 'Black' : 'White');
                        const asset = Resources.WhitePawn
                        piecesInPlay[invert(blockingPiecePosition.col)][invert(blockingPiecePosition.row)].sprite = asset.toSprite()
                        piecesInPlay[invert(blockingPiecePosition.col)][invert(blockingPiecePosition.row)].sprite.width = 100
                        piecesInPlay[invert(blockingPiecePosition.col)][invert(blockingPiecePosition.row)].sprite.height = 100
                        piecesInPlay[invert(blockingPiecePosition.col)][invert(blockingPiecePosition.row)].onInitialize()
                        break;
                    case 'king':
                        const col = invert(blockingPiecePosition.col)
                        const row = invert(blockingPiecePosition.row)
                        this.remove( piecesInPlay[col][row])
                        const newKnight =  new Knight(((player === 'player1') ? Resources.BlackKnight : Resources.WhiteKnight), {col: col, row: row }, this.board.tiles, ((player === 'player1') ? 'Black' : 'White'), this)
                        this.add(newKnight)
                        piecesInPlay[col][row] = newKnight
                        break;
                    case 'pawn':
                        const newCol = invert(blockingPiecePosition.col)
                        const newRow = invert(blockingPiecePosition.row)
                        const child = new Pawn(((player === 'player1') ? Resources.BlackPawn : Resources.WhitePawn), {col: newCol, row: newRow }, this.board.tiles, ((player === 'player1') ? 'Black' : 'White'), this)
                        piecesInPlay[newCol][newRow] = child
                        this.add(child)
                        break;
                  }
                  nextTurn(whichPlayer)
            }
        })

        socket.on('queen-ex-move-from-server', (whichPlayer: string, kingPosition: {col: number, row: number}, queenPosition: {col: number, row: number}) => {
            if(whichPlayer != player) {
                const king = piecesInPlay[invert(kingPosition.col)][invert(kingPosition.row)]
                const queen = piecesInPlay[invert(queenPosition.col)][invert(queenPosition.row)]

                king.move(invert(queenPosition.col), invert(queenPosition.row))
                queen.move(invert(kingPosition.col), invert(kingPosition.row))
            }
        })

        socket.on('king-state-animation', (whichPlayer: string, checkmate: boolean) => {
            if(checkmate) {
                this.checkmateAnimation.animateCheckmate()
                endGame()
                var text = new ex.Text({
                    text: '',
                    font: new ex.Font({ family: 'impact', size: 40, shadow: {color: ex.Color.Black, offset: ex.vec(1,1)} }),
                    color: ex.Color.fromHex('#FFFFFF')
                })
                if(whichPlayer === player) {
                    text.text = 'You Lose'
                } else {
                    text.text = 'You Win'
                }

                const actor = new ex.Actor({
                    pos: ex.vec(400, 500)
                });
                actor.graphics.use(text);
                this.add(actor)
            }
            else
                this.checkAnimation.animateCheck()
        })

        socket.on('player-disconnected', () => {
            $('#myModal').show(); // Open the modal

            $("#close-modal").on("click",function(e) { 
                e.preventDefault();
                location.reload()
              });
        })
    }

    
    renderView() {
        if(player === 'player2') {
            this.whiteSidePawns = 1
            this.whiteSideBigPieces = 0
            this.blackSidePawns = 6
            this.blackSideBigPieces = 7
        }
        //White
        piecesInPlay[0][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 0, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[1][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 1, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[2][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 2, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[3][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 3, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[4][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 4, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[5][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 5, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[6][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 6, row: this.whiteSidePawns }, this.board.tiles, 'White', this)
        piecesInPlay[7][this.whiteSidePawns] = new Pawn(Resources.WhitePawn, {col: 7, row: this.whiteSidePawns }, this.board.tiles, 'White', this)

        piecesInPlay[0][this.whiteSideBigPieces] = new Rook(Resources.WhiteRook, {col: 0, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[1][this.whiteSideBigPieces] = new Knight(Resources.WhiteKnight, {col: 1, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[2][this.whiteSideBigPieces] = new Bishop(Resources.WhiteBishop, {col: 2, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[((player === 'player1') ? 3 : 4)][this.whiteSideBigPieces] = new Queen(Resources.WhiteQueen, {col: ((player === 'player1') ? 3 : 4), row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[((player === 'player1') ? 4 : 3)][this.whiteSideBigPieces] = new King(Resources.WhiteKing, {col: ((player === 'player1') ? 4 : 3), row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[5][this.whiteSideBigPieces] = new Bishop(Resources.WhiteBishop, {col: 5, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[6][this.whiteSideBigPieces] = new Knight(Resources.WhiteKnight, {col: 6, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)
        piecesInPlay[7][this.whiteSideBigPieces] = new Rook(Resources.WhiteRook, {col: 7, row: this.whiteSideBigPieces }, this.board.tiles, 'White', this)

        //Black
        piecesInPlay[0][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 0, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[1][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 1, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[2][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 2, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[3][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 3, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[4][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 4, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[5][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 5, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[6][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 6, row: this.blackSidePawns }, this.board.tiles, 'Black', this)
        piecesInPlay[7][this.blackSidePawns] = new Pawn(Resources.BlackPawn, {col: 7, row: this.blackSidePawns }, this.board.tiles, 'Black', this)

        piecesInPlay[0][this.blackSideBigPieces] = new Rook(Resources.BlackRook, {col: 0, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[1][this.blackSideBigPieces] = new Knight(Resources.BlackKnight, {col: 1, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[2][this.blackSideBigPieces] = new Bishop(Resources.BlackBishop, {col: 2, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[((player === 'player1') ? 4 : 3)][this.blackSideBigPieces] = new King(Resources.BlackKing, {col: ((player === 'player1') ? 4 : 3), row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[((player === 'player1') ? 3: 4)][this.blackSideBigPieces] = new Queen(Resources.BlackQueen, {col: ((player === 'player1') ? 3: 4), row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[5][this.blackSideBigPieces] = new Bishop(Resources.BlackBishop, {col: 5, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[6][this.blackSideBigPieces] = new Knight(Resources.BlackKnight, {col: 6, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)
        piecesInPlay[7][this.blackSideBigPieces] = new Rook(Resources.BlackRook, {col: 7, row: this.blackSideBigPieces }, this.board.tiles, 'Black', this)


        setKings(piecesInPlay[((player === 'player1') ? 4 : 3)][this.whiteSideBigPieces], piecesInPlay[((player === 'player1') ? 4 : 3)][this.blackSideBigPieces]) 
    }
}