import { derived, get, writable, type Writable, type Readable } from 'svelte/store';
import { FieldState, GameStatus } from './enums';
import type { BoardState, Stone, Unit } from './types';
import { getLibertiesOfUnit, getSurroundingUnitsFromUnit, getUnitContainingCoordinates } from '$lib/game/utils';
import { getAreaScoring } from '$lib/game/scorings';
import { Sound, playSound } from '$lib/utils';

export class Game {
    public width: number;
    public height: number;
    public status: Writable<GameStatus>;
    public boardState: Writable<BoardState>;
    public cleanedBoardState: Readable<BoardState>;
    public deadStones: Writable<Stone[]>;
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
        this.deadStones = writable([]);
        this.cleanedBoardState = derived([this.boardState, this.deadStones], ([boardState, deadStones]) => {
            const cleanedBoardState: BoardState = structuredClone(boardState);
            deadStones.forEach(stone => {
                cleanedBoardState[stone.x][stone.y] = FieldState.Empty;
            });
            return cleanedBoardState;
        });
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

        const unit = this.getUnitContainingCoordinates(x, y);
        
        let didAtari = false;
        const surroundingUnits = this.getSurroundingUnitsFromUnit(unit);
        const unitsToRemove = [];
        for (const surroundingUnit of surroundingUnits) {
            const adjacentLiberties = this.getLibertiesOfUnit(surroundingUnit);

            const isAtari = adjacentLiberties.length === 1;
            if (isAtari) {
                didAtari = true;
                continue;
            }

            const isCapture = adjacentLiberties.length === 0;
            if (isCapture) {
                unitsToRemove.push(surroundingUnit);
            }
        }

        const ownLiberties = this.getLibertiesOfUnit(unit);
        if (!unitsToRemove.length && ownLiberties.length === 0) {
            unitsToRemove.push(unit);
        }
        unitsToRemove.forEach((_unit) => this.removeUnit(_unit));

        this.playGameSound(!!unitsToRemove.length, didAtari);
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
            this.status.set(GameStatus.ChooseDeadStones);
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

    getWinner(): string {
        const { black, white } = this.getFinalScore();
        return black > white ? 'Black' : 'White';
    }

    addOrRemoveDeadStones(unit: Unit): void {
        this.deadStones.update(stones => {
            if (unit.length === 0) {
                return stones;
            }

            unit.forEach(_stone => {
                const deadStoneIndex = stones.findIndex(stone => stone.x === _stone.x && stone.y === _stone.y);
                console.log(deadStoneIndex);
                
                if (deadStoneIndex >= 0) {
                    stones.splice(deadStoneIndex, 1);
                } else {
                    stones.push(_stone);
                }
            });
            return stones;
        });
    }

    finishGame(): void {
        this.status.set(GameStatus.Ended);
    }
    
    removeUnit(unit: Unit): void {
        this.boardState.update(state => {
            unit.forEach(stone => {
                state[stone.x][stone.y] = FieldState.Empty;
            });
            return state;
        });
    }

    playGameSound(didCapture: boolean, didAtari: boolean): void {
        let sound: Sound = Sound.PlaceStone;
        if (didCapture) {
            sound = Sound.KillUnit;
        } else if (didAtari) {
            sound = Sound.Atari;
        } else {
            sound = Sound.PlaceStone;
        }
        playSound(sound);
    }

    getSurroundingUnitsFromUnit(unit: Unit): Unit[] {
        return getSurroundingUnitsFromUnit(unit, get(this.boardState));
    }

    getUnitContainingCoordinates(x: number, y: number): Unit {
        return getUnitContainingCoordinates(x, y, get(this.boardState));
    }

    getLibertiesOfUnit(unit: Unit): Stone[] {
        return getLibertiesOfUnit(unit, get(this.boardState));
    }
}
