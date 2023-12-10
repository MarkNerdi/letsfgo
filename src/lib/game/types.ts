import type { FieldState } from './enums';

export type BoardState = FieldState[][]

export type Stone = {
    x: number,
    y: number,
}

export type Unit = Stone[];
