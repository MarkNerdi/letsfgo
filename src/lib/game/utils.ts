import type { BoardState } from '$lib/game/types';

export function getUnitContainingCoordinates(x: number, y: number, board: BoardState, width: number, height: number): { x: number, y: number }[] {
    const unit: { x: number, y: number }[] = [];
    const visited: { [key: string]: boolean } = {};
    const color = board[x][y];

    function getUnitRecursively(currentX: number, currentY: number) {
        if (visited[`${currentX},${currentY}`]) {
            return;
        }

        visited[`${currentX},${currentY}`] = true;
        if (board[currentX][currentY] !== color) {
            return;
        }

        unit.push({ x: currentX, y: currentY });
        
        const adjacentCoordinates = getAdjacentCoordinates(currentX, currentY, width, height);
        adjacentCoordinates.forEach(adjacent => {
            getUnitRecursively(adjacent.x, adjacent.y);
        });
    }

    getUnitRecursively(x, y);
    return unit;
}

function getAdjacentCoordinates(x: number, y: number, boardWidth: number, boardHeight: number): { x: number, y: number }[] {
    const liberties: { x: number, y: number }[] = [];
    if (x > 0) {
        liberties.push({ x: x - 1, y });
    }
    if (x < boardWidth - 1) {
        liberties.push({ x: x + 1, y });
    }
    if (y > 0) {
        liberties.push({ x, y: y - 1 });
    }
    if (y < boardHeight - 1) {
        liberties.push({ x, y: y + 1 });
    }
    return liberties;
}
