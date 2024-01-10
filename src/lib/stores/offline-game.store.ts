import { DEFAULT_SETTINGS } from '$lib/constants/default-settings.constants';
import { Game } from '$lib/game/game';
import { writable, type Writable } from 'svelte/store';

export const offlineGame: Writable<Game> = writable(new Game(DEFAULT_SETTINGS));
