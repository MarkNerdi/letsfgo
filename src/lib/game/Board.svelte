<script lang="ts">
    import type { Game } from '$lib/game/game';
    import type { BoardState, Stone as StoneType } from '$lib/game/types';
    import { getEvaluatedBoardState, getUnitContainingCoordinates } from '$lib/game/utils';
    import type { Readable, Writable } from 'svelte/store';
    import { GameStatus, PlayerColor } from './enums';
    import { getValidNextMoves } from '$lib/game/validation';
    import { Card } from '$lib/components/ui/card';
    import Stone from '$lib/components/Stone.svelte';

    export let game: Game;
    export let player: PlayerColor | undefined;

    const boardSize = 700;
    const boardPadding = 50;


    let status: Writable<GameStatus> = game.status;
    let boardState: Readable<BoardState> = game.boardState; 
    let history: Writable<string[]> = game.history; 
    let cleanedBoardState: Readable<BoardState> = game.cleanedBoardState;
    let deadStones: Writable<StoneType[]> = game.deadStones;
    let currentTurn: Readable<PlayerColor> = game.currentTurn;

    $: if (game) {
        ({ boardState, cleanedBoardState, deadStones, status, currentTurn, history } = game);
    }

    $: evaluatedBoardState =
        $status === GameStatus.ChooseDeadStones || $status === GameStatus.Ended ? getEvaluatedBoardState($cleanedBoardState) : undefined;

    $: columns = $boardState.length ? 9 : 9;
    $: rows = $boardState[0]?.length ? 9 : 9;
    $: stoneSize = boardSize / Math.max(columns, rows);
    $: validNextMoves = getValidNextMoves($boardState, $history, $currentTurn);


    $: console.log($status);
    $: console.log(player);
    

    async function onEmptyClick(x: number, y: number): Promise<void> {
        if (!game) return;

        game.setStone(player, x, y);

        await fetch(`/api/game/${game.id}/add-move`, {
            method: 'POST',
            body: JSON.stringify({
                action: `${x},${y}`,
            }),
        }).catch(err => console.error(err));
    }

    let hoveredCoordinate: StoneType | undefined = undefined;
    $: hoveredUnit = hoveredCoordinate
        ? getUnitContainingCoordinates(hoveredCoordinate?.x, hoveredCoordinate?.y, $boardState)
        : undefined;

    function onUnitClick(x: number, y: number): void {
        if ($boardState[x][y] === undefined) return;
        const unit = getUnitContainingCoordinates(x, y, $boardState);
        game.addOrRemoveDeadStones(unit);
    }
</script>

<Card >
    <outer-game-board
        style:width={`${boardSize + boardPadding}px`}
        style:height={`${boardSize + boardPadding}px`}
    >
        <inner-game-board style:width={`${boardSize}px`} style:height={`${boardSize}px`}>
            <grid
                style:grid-template-columns={`repeat(${columns - 1}, ${stoneSize}px)`}
                style:grid-template-rows={`repeat(${rows - 1}, ${stoneSize}px)`}
            >
                {#each Array(columns - 1) as _}
                    {#each Array(rows - 1) as _}
                        <grid-cell></grid-cell>
                    {/each}
                {/each}
            </grid>
            <game-board
                style:grid-template-columns={`repeat(${columns}, ${stoneSize}px)`}
                style:grid-template-rows={`repeat(${rows}, ${stoneSize}px)`}
            >
                {#each Array(columns) as _, index}
                    {#each Array(rows) as _, index2}
                        <board-item class="h-full w-full">
                            {#if !boardState || !$boardState}
                                <!-- empty -->
                            {:else if $status === GameStatus.ChooseDeadStones && evaluatedBoardState}
                                {@const isBlack = evaluatedBoardState[index][index2] === PlayerColor.Black}
                                {@const isWhite = evaluatedBoardState[index][index2] === PlayerColor.White}
                                {#if $boardState[index][index2] !== undefined}
                                    {@const isHovered = hoveredUnit?.some(
                                        (stone) => stone.x === index && stone.y === index2
                                    )}
                                    {@const isDead = $deadStones?.some(
                                        (stone) => stone.x === index && stone.y === index2
                                    )}
                                    <button class="choose-unit {isHovered || isDead ? 'opacity-60' : ''}}"
                                        on:click={() => onUnitClick(index, index2)}
                                        on:mouseleave={() => (hoveredCoordinate = undefined)}
                                        on:mouseenter={() => (hoveredCoordinate = { x: index, y: index2 })}
                                    >
                                        <Stone color={$boardState[index][index2]}>
                                            <evaluated-field class:black={isBlack} class:white={isWhite} />
                                        </Stone>
                                    </button>
                                {:else}
                                    <evaluated-field class:black={isBlack} class:white={isWhite} />
                                {/if}
                            {:else if $status === GameStatus.Ended && evaluatedBoardState}
                                {#if cleanedBoardState && $cleanedBoardState[index][index2] !== undefined}
                                    <Stone color={$cleanedBoardState[index][index2]} >
                                        <evaluated-field
                                            class:black={evaluatedBoardState[index][index2] === PlayerColor.Black}
                                            class:white={evaluatedBoardState[index][index2] === PlayerColor.White}
                                        />
                                    </Stone>
                                {:else}
                                    <evaluated-field
                                        class:black={evaluatedBoardState[index][index2] === PlayerColor.Black}
                                        class:white={evaluatedBoardState[index][index2] === PlayerColor.White}
                                    />
                                {/if}
                            {:else}
                                {#if $boardState[index][index2] === undefined}
                                    {#if player === $currentTurn}
                                        {#if validNextMoves[index][index2]}
                                            <button class="place-stone" on:click={() => onEmptyClick(index, index2)}>
                                                <Stone color={player} />
                                            </button>
                                        {:else}
                                            <!-- TODO: Add errorstate -->
                                            <div />
                                        {/if}
                                    {:else}
                                        <div />
                                    {/if}
                                {:else}
                                    <Stone color={$boardState[index][index2]} />
                                {/if}
                            {/if}
                        </board-item>
                    {/each}
                {/each}
            </game-board>
        </inner-game-board>
    </outer-game-board>
</Card>

<style lang="postcss" scoped>
    outer-game-board {
        @apply flex justify-center items-center gap-4 rounded-lg;
        background-image: url('../assets/boards/marble.jpg');
        background-size: cover;
    }

    inner-game-board {
        @apply flex justify-center items-center gap-4;
        position: relative;
    }

    grid {
        @apply border border-solid border-gray-500;
        display: grid;
        grid-template-rows: auto;
        position: absolute;

        grid-cell {
            @apply flex justify-center items-center;
            @apply border border-solid border-gray-500;
            @apply w-full h-full;
        }
    }

    game-board {
        @apply grid z-20;
        grid-template-rows: auto;
    }

    board-item {
        @apply flex justify-center items-center;
        @apply w-full h-full box-border;
    }

    .place-stone {
        @apply w-full h-full cursor-pointer;
        @apply flex justify-center items-center;
        @apply bg-transparent;
        @apply opacity-0;

        &:hover {
            @apply opacity-60;
        }
    }

    .choose-unit {
        @apply w-full h-full cursor-pointer;
        @apply flex justify-center items-center;
        @apply bg-transparent;
    }

    evaluated-field {
        @apply w-3/12 h-1/4;
        @apply flex justify-center items-center;
        @apply bg-transparent;

        &.black {
            @apply bg-black;
            @apply border-2 border-solid border-white;
        }

        &.white {
            @apply bg-white;
            @apply border-2 border-solid border-black;
        }
    }
</style>
