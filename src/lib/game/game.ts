import { writable, type Writable } from 'svelte/store';
import { FieldState } from './enums';
import type { BoardState } from './types';

export class Game {
    public width: number;
    public height: number;
    public state: Writable<BoardState>;
    public history: Writable<string[]>;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.state = writable(Array.from({ length: height }, ()=> {
            return Array.from({ length: width }, () => FieldState.Empty);
        })); 
        this.history = writable([]);
    }

    setStone(stone: FieldState, x: number, y: number): void {
        if (x >= this.width || x < 0 || y >= this.height || y < 0) {
            throw Error;
        }
        console.log(`setStone(${stone}, ${x}, ${y})`);
        
        this.state.update(state => {
            state[x][y] = stone;
            return state;
        });
    }
}
