import { Piece } from "../Models/Piece/Piece.model"

const piecesInPlay: any[][] = []
for (let i = 0; i < 8; i++) {
    piecesInPlay.push([])
    for(let j = 0; j < 8; j++) {
        piecesInPlay[i].push(null) 
    }
}
export {piecesInPlay}