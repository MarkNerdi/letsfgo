import { derived, get, writable, type Writable, type Readable } from 'svelte/store';
import { GameStatus, PlayerColor, ResultType, Sound } from './enums';
import type { BoardState, GameResult, GameSettings, Stone, Unit } from './types';
import { getPlayerByTurn, placeStone } from '$lib/game/utils';
import { getAreaScoring } from '$lib/game/scorings';
import { playSound } from '$lib/utils/sound';
import type { Game as DBGame, Move } from '$lib/server/games/games.types';

export class Game {
    public id: string;
    public status: Writable<GameStatus>;
    public boardState: Readable<BoardState>;
    public cleanedBoardState: Readable<BoardState>;
    public deadStones: Writable<Stone[]>;
    public displayedTurn: Writable<number>;
    public history: Writable<string[]>;
    public killedStones: Writable<{ black: number, white: number }[]>;
    public allBoardStates: Writable<BoardState[]>;
    public currentTurn: Readable<PlayerColor>;
    public settings: GameSettings;
    public result: Writable<GameResult | undefined>;

    constructor(id: string, settings: GameSettings) {
        this.id = id;
        this.settings = settings;

        this.history = writable([]);
        this.currentTurn = derived([this.history], ([history]) => getPlayerByTurn(history.length));
        this.status = writable(GameStatus.NotStarted);
        this.deadStones = writable([]);
        this.result = writable(undefined);
        this.killedStones = writable([]);
        this.displayedTurn = writable(0);


        const initialBoardState: BoardState = Array.from({ length: settings.height }, () => {
            return Array.from({ length: settings.width }, () => undefined);
        });
        this.allBoardStates = writable([initialBoardState]);

        this.boardState = derived([this.allBoardStates, this.displayedTurn], ([allBoardStates, displayedTurn]) => {
            return allBoardStates[displayedTurn];
        });

        this.cleanedBoardState = derived([this.boardState, this.deadStones], ([boardState, deadStones]) => {
            const cleanedBoardState: BoardState = structuredClone(boardState);
            deadStones.forEach(stone => {
                cleanedBoardState[stone.x][stone.y] = undefined;
            });
            return cleanedBoardState;
        });
    }

    static init(dbGame: DBGame): Game {
        const game = new Game(String(dbGame._id), dbGame.settings);
        game.updateHistory(dbGame.history, false);

        game.status.set(dbGame.status);
        game.result.set(dbGame.result);
        if (dbGame.result?.type === ResultType.ByScore) {
            game.deadStones.set(dbGame.result.deadStones);
        }

        return game;
    }

    setStone(stone: PlayerColor, x: number, y: number, playSound: boolean = true): void {
        if (x >= this.settings.width || x < 0 || y >= this.settings.height || y < 0) {
            throw Error;
        }

        if (get(this.status) === GameStatus.NotStarted) {
            this.status.set(GameStatus.InProgress);
        }

        this.history.update(history => {
            history.push(`${x},${y}`);
            return history;
        });
        this.displayedTurn.set(get(this.history).length);


        const currentBoardState = structuredClone(get(this.allBoardStates)[get(this.allBoardStates).length - 1]);
        const {
            atari,
            capturedStones,
        } = placeStone(currentBoardState, x, y, stone);

        this.allBoardStates.update(allBoardStates => {
            allBoardStates.push(currentBoardState);
            return allBoardStates;
        });
        if (playSound) {
            this.playGameSound(!!capturedStones.length, atari);
        }
    }

    setDisplayedTurn(step: 'start' | 'previous' | 'next' | 'end'): void {
        const history = get(this.history);
        const displayedTurn = get(this.displayedTurn);
        if (step === 'start') {
            this.displayedTurn.set(0);
        } else if (step === 'previous') {
            this.displayedTurn.set(Math.max(displayedTurn - 1, 0));
        } else if (step === 'next') {
            this.displayedTurn.set(Math.min(displayedTurn + 1, history.length));
        } else if (step === 'end') {
            this.displayedTurn.set(history.length);
        }
    }

    pass(): void {
        if (get(this.status) === GameStatus.NotStarted) {
            this.status.set(GameStatus.InProgress);
        }

        this.history.update(history => {
            history.push('pass');
            return history;
        });
        this.displayedTurn.set(get(this.history).length);

        const currentBoardState = structuredClone(get(this.allBoardStates)[get(this.allBoardStates).length - 1]);
        this.allBoardStates.update(allBoardStates => {
            allBoardStates.push(currentBoardState);
            return allBoardStates;
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
        return getAreaScoring(get(this.cleanedBoardState), this.settings.komi);
    }

    getWinner(): string {
        const { black, white } = this.getFinalScore();
        return black > white ? 'Black' : 'White';
    }

    updateHistory(history: Move[], playSound = true): void {
        if (history.length === get(this.history).length) {
            return;
        }

        if (history.length > get(this.history).length) {
            for (let turn = get(this.history).length; turn < history.length; turn++) {
                const move = history[turn];
                if (move.action === 'pass') {
                    this.pass();
                } else {
                    const [x, y] = move.action.split(',').map(Number);
                    const stone = getPlayerByTurn(turn);
                    this.setStone(stone, x, y, playSound);
                }
            }
        }
    }

    addOrRemoveDeadStones(unit: Unit): void {
        this.deadStones.update(stones => {
            if (unit.length === 0) {
                return stones;
            }

            unit.forEach(_stone => {
                const deadStoneIndex = stones.findIndex(stone => stone.x === _stone.x && stone.y === _stone.y);
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
}
