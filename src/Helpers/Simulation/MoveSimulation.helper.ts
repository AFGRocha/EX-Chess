export function simulateMove(board: any[][], move: any) {
    let tempBoard: any[][] = [[],[],[],[],[],[],[],[]]

    for (var pieces in board) {
        tempBoard[pieces] = [...board[pieces]]
    }

    const piece = tempBoard[move.piecePosition.col][move.piecePosition.row]
    tempBoard[move.piecePosition.col][move.piecePosition.row] = null
    piece.currentPosition = {col: move.col, row: move.row}
    tempBoard[move.col][move.row]  = piece
    
    return tempBoard
}