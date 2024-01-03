import type { User as AuthUser } from '@auth/core/types';

export type User = AuthUser | {
    username: string;

    createdAt: number;
};
