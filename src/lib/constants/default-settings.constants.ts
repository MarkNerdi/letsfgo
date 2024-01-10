import { Scoring } from '$lib/game/enums';
import type { GameSettings } from '$lib/game/types';

export const DEFAULT_KOMI = 6.5;
export const DEFAULT_SCORING = Scoring.Area;

export const DEFAULT_SETTINGS: GameSettings = {
    width: 9,
    height: 9,
    initialTime: 10,
    increment: 10,
    komi: DEFAULT_KOMI,
    scoring: DEFAULT_SCORING,
};
