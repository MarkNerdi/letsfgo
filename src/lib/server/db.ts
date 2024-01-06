import { PRIVATE_DB_CONNECTION_STRING } from '$env/static/private';
import type { GameInvite } from '$lib/server/game-invites/game-invites.types';
import type { Game } from '$lib/server/games/games.types';
import type { Lobby } from '$lib/server/lobbies/lobbies.types';
import { MongoClient } from 'mongodb';

const client = new MongoClient(PRIVATE_DB_CONNECTION_STRING);
export const db = client.db();

export const mongoClient = client.connect();

export const gameCollection = db.collection<Game>('game');
export const inviteCollection = db.collection<GameInvite>('invite');
export const lobbyCollection = db.collection<Lobby>('lobby');
