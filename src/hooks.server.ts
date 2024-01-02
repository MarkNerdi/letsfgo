import { SvelteKitAuth } from '@auth/sveltekit';
import GoogleProvider from '@auth/core/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    PRIVATE_DB_NAME,
    AUTH_SECRET
} from '$env/static/private';
import { mongoClient } from '$lib/server/db';

export const handle = SvelteKitAuth({
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
    ],
    adapter: MongoDBAdapter(mongoClient, { databaseName: PRIVATE_DB_NAME }),
    secret: AUTH_SECRET,
});
