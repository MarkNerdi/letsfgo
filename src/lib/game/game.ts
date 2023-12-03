import { get, writable, type Writable } from 'svelte/store';
import { FieldState } from './enums';
import type { BoardState } from './types';
import sound from '$lib/assets/sounds/vine-boom.mp3';
import { getLibertiesOfUnit, getSurroundingUnitsFromUnit, getUnitContainingCoordinates } from '$lib/game/utils';

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
        

        this.history.update(history => {
            history.push(`${x},${y}`);
            return history;
        });
        this.state.update(state => {
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
                new Audio(sound).play();
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

    removeUnit(unit: { x: number, y: number }[]): void {
        this.state.update(state => {
            unit.forEach(stone => {
                state[stone.x][stone.y] = FieldState.Empty;
            });
            return state;
        });
    }

    getSurroundingUnitsFromUnit(unit: { x: number, y: number }[]): { x: number, y: number }[][] {
        return getSurroundingUnitsFromUnit(unit, get(this.state), this.width, this.height);
    }

    getUnitContainingCoordinates(x: number, y: number): { x: number, y: number }[] {
        return getUnitContainingCoordinates(x, y, get(this.state), this.width, this.height);
    }

    getLibertiesOfUnit(unit: { x: number, y: number }[]): { x: number, y: number }[] {
        return getLibertiesOfUnit(unit, get(this.state), this.width, this.height);
    }

    getCurrentColor(): FieldState {
        const history = get(this.history);
        return history.length % 2 === 0 ? FieldState.White : FieldState.Black;
    }
}
