import { PRIVATE_DB_CONNECTION_STRING } from '$env/static/private';
import type { Game } from '$lib/server/games/games.types';
import { MongoClient } from 'mongodb';

const client = new MongoClient(PRIVATE_DB_CONNECTION_STRING);
export const db = client.db();

export async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to mongodb');

    } catch (error) {
        console.log(error);
    }
}

