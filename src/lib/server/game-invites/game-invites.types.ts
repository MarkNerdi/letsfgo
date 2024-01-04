import type { GameSettings } from '$lib/game/types';
import type { ObjectId } from 'mongodb';

export type GameInvite = {
    _id?: ObjectId | string;

    invitedUserId?: ObjectId
    settings: GameSettings;
    state: InviteState;

    createdBy: ObjectId | string;
    createdAt: number;
};

export enum InviteState {
    Pending,
    Accepted,
    Declined
}
