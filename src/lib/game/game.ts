import { derived, get, writable, type Writable, type Readable } from 'svelte/store';
import { FieldState, GameStatus } from './enums';
import type { BoardState } from './types';
import sound from '$lib/assets/sounds/vine-boom.mp3';
import { getLibertiesOfUnit, getSurroundingUnitsFromUnit, getUnitContainingCoordinates } from '$lib/game/utils';
import { getAreaScoring } from '$lib/game/scorings';
import { playSound } from '$lib/utils';

export class Game {
    public width: number;
    public height: number;
    public status: Writable<GameStatus>;
    public boardState: Writable<BoardState>;
    public history: Writable<string[]>;
    public currentPlayer: Readable<FieldState>;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.boardState = writable(Array.from({ length: height }, ()=> {
            return Array.from({ length: width }, () => FieldState.Empty);
        })); 
        this.history = writable([]);
        this.currentPlayer = derived([this.history], ([history]) => {
            return history.length % 2 === 0 ? FieldState.Black : FieldState.White;
        });
        this.status = writable(GameStatus.NotStarted);
    }

    setStone(stone: FieldState, x: number, y: number): void {
        if (x >= this.width || x < 0 || y >= this.height || y < 0) {
            throw Error;
        }

        if (get(this.history).length === 0) {
            this.status.set(GameStatus.InProgress);
        }

        this.history.update(history => {
            history.push(`${x},${y}`);
            return history;
        });
        this.boardState.update(state => {
            state[x][y] = stone;
            return state;
        });

        let didCaptureSomething = false;
        const unit = this.getUnitContainingCoordinates(x, y);
        
        const surroundingUnits = this.getSurroundingUnitsFromUnit(unit);
        for (const surroundingUnit of surroundingUnits) {
            const adjacentLiberties = this.getLibertiesOfUnit(surroundingUnit);

            const isAtari = adjacentLiberties.length === 1;
            if (isAtari) {
                playSound(sound);
            }

            const isCapture = adjacentLiberties.length === 0;
            if (isCapture) {
                didCaptureSomething = true;
                this.removeUnit(surroundingUnit);
            }
        }

        const liberties = this.getLibertiesOfUnit(unit);

        if (!didCaptureSomething && liberties.length === 0) {
            this.removeUnit(unit);
        }
    }

    pass(): void {
        if (get(this.history).length === 0) {
            this.status.set(GameStatus.InProgress);
        }

        this.history.update(history => {
            history.push('pass');
            return history;
        });

        const [secondLast, last] = get(this.history).slice(-2);
        if (secondLast === 'pass' && last === 'pass') {
            this.status.set(GameStatus.Ended);
        }
    }

    surrender(): void {
        this.status.set(GameStatus.Ended);

        this.history.update(history => {
            history.push('resign');
            return history;
        });
    }

    getFinalScore(): { black: number, white: number } {
        return getAreaScoring(get(this.boardState));
    }

    getWinner(): FieldState {
        const { black, white } = this.getFinalScore();
        return black > white ? FieldState.Black : FieldState.White;
    }

    removeUnit(unit: { x: number, y: number }[]): void {
        this.boardState.update(state => {
            unit.forEach(stone => {
                state[stone.x][stone.y] = FieldState.Empty;
            });
            return state;
        });
    }

    getSurroundingUnitsFromUnit(unit: { x: number, y: number }[]): { x: number, y: number }[][] {
        return getSurroundingUnitsFromUnit(unit, get(this.boardState));
    }

    getUnitContainingCoordinates(x: number, y: number): { x: number, y: number }[] {
        return getUnitContainingCoordinates(x, y, get(this.boardState));
    }

    getLibertiesOfUnit(unit: { x: number, y: number }[]): { x: number, y: number }[] {
        return getLibertiesOfUnit(unit, get(this.boardState));
    }
}
