import { SvelteKitAuth } from '@auth/sveltekit';
import GoogleProvider from '@auth/core/providers/google';
import EmailProvider from '@auth/core/providers/email';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    PRIVATE_DB_NAME,
    AUTH_SECRET,
    PRIVATE_EMAIL_SERVER_HOST,
    PRIVATE_EMAIL_SERVER_PORT,
    PRIVATE_EMAIL_SERVER_USER,
    PRIVATE_EMAIL_SERVER_PASSWORD,
    PRIVATE_EMAIL_FROM
} from '$env/static/private';
import { mongoClient } from '$lib/server/db';

export const handle = SvelteKitAuth({
    providers: [
        EmailProvider({
            server: {
                host: PRIVATE_EMAIL_SERVER_HOST,
                port: PRIVATE_EMAIL_SERVER_PORT,
                auth: {
                    user: PRIVATE_EMAIL_SERVER_USER,
                    pass: PRIVATE_EMAIL_SERVER_PASSWORD,
                },
            },
            from: PRIVATE_EMAIL_FROM,
        }),
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            profile(profile) {
                const defaultUserName = profile.email.split('@')[0];

                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    username: defaultUserName,
                    createdAt: Date.now(),
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            session.user = user;
            
            return session;
        },
    },
    adapter: MongoDBAdapter(mongoClient, { databaseName: PRIVATE_DB_NAME }),
    trustHost: true,
    secret: AUTH_SECRET,
});
