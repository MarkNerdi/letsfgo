import { PRIVATE_DB_CONNECTION_STRING } from '$env/static/private';
import type { Game } from '$lib/server/games/games.types';
import { MongoClient } from 'mongodb';

const client = new MongoClient(PRIVATE_DB_CONNECTION_STRING);
export const db = client.db();

export const mongoClient = client.connect();

export const gameCollection = db.collection<Game>('game');
