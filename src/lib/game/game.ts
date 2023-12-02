import {FieldState} from './enums'
import {BoardState} from './types'

export class Game {
    public width: number
    public height: number
    public state: BoardState

    constructor(width: number, height: number) {
        this.width = width
        this.height = height

        this.state = Array.from({ length: height }, ()=> {
            return Array.from({ length: width }, () => FieldState.Empty)
        }) 
    }

    setStone(stone: FieldState, x: number, y: number): void {
        if (x >= this.width || x < 0 || y >= this.height || y < 0) {
            throw Error
        }
        this.state[y][x] = stone
    }
}
