<script lang="ts">
    import type { Game } from '$lib/game/game';
    import type { Stone } from '$lib/game/types';
    import { getEvaluatedBoardState, getUnitContainingCoordinates } from '$lib/game/utils';
    import { FieldState, GameStatus } from './enums';

    export let game: Game | undefined;
    export let color: 'burlywood' | 'white' = 'white';


    const boardSize = 700;
    const boardPadding = 50;
    $: boardState = game?.boardState;
    $: cleanedBoardState = game?.cleanedBoardState;
    $: currentPlayer = game?.currentPlayer;
    $: deadStones = game?.deadStones;
    $: gameStatus = game?.status;

    $: evaluatedBoardState =
        cleanedBoardState && $cleanedBoardState && $gameStatus === GameStatus.ChooseDeadStones
            ? getEvaluatedBoardState($cleanedBoardState)
            : undefined;


    $: columns = boardState && $boardState ? $boardState.length ?? 9 : 9;
    $: rows = boardState && $boardState ? $boardState[0]?.length ?? 9 : 9;
    $: stoneSize = boardSize / Math.max(columns, rows);


    function onEmptyClick(x: number, y: number): void {
        const _currentPlayer = $currentPlayer;
        if (!game || !_currentPlayer) return;
        game.setStone(_currentPlayer, x, y);
    }

    let hoveredCoordinate: Stone | undefined = undefined;
    $: hoveredUnit =
        hoveredCoordinate && $boardState
            ? getUnitContainingCoordinates(hoveredCoordinate?.x, hoveredCoordinate?.y, $boardState)
            : undefined;

    function onUnitClick(x: number, y: number): void {
        const _boardState = $boardState;
        if (!_boardState || !game) return;

        if (_boardState[x][y] === FieldState.Empty) return;

        const unit = getUnitContainingCoordinates(x, y, _boardState);
        game.addOrRemoveDeadStones(unit);
    }
</script>

<outer-game-board
    class:burlywood={color === 'burlywood'}
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
                        {:else if $gameStatus === GameStatus.ChooseDeadStones && evaluatedBoardState}
                            <button
                                class="choose-unit"
                                on:click={() => onUnitClick(index, index2)}
                                on:mouseleave={() => (hoveredCoordinate = undefined)}
                                on:mouseenter={() => (hoveredCoordinate = { x: index, y: index2 })}
                            >
                                {#if $boardState[index][index2] === FieldState.Empty}
                                    <evaluated-field
                                        class:black={evaluatedBoardState[index][index2] === FieldState.Black}
                                        class:white={evaluatedBoardState[index][index2] === FieldState.White}
                                    />
                                {:else}
                                    {@const isHovered = hoveredUnit?.some(
                                        (stone) => stone.x === index && stone.y === index2
                                    )}
                                    {@const isDead = $deadStones?.some(
                                        (stone) => stone.x === index && stone.y === index2
                                    )}
                                    <stone
                                        class:black={$boardState[index][index2] === FieldState.Black}
                                        class:hovered={isHovered}
                                        class:dead={isDead}
                                    >
                                        <evaluated-field
                                            class:black={evaluatedBoardState[index][index2] === FieldState.Black}
                                            class:white={evaluatedBoardState[index][index2] === FieldState.White}
                                        />
                                    </stone>
                                {/if}
                            </button>
                        {:else if $gameStatus === GameStatus.Ended}
                            {#if $cleanedBoardState && $cleanedBoardState[index][index2] !== FieldState.Empty}
                                <stone class:black={$cleanedBoardState[index][index2] === FieldState.Black} />
                            {:else}
                                <!-- else content here -->
                            {/if}
                        {:else if $boardState[index][index2] === FieldState.Empty}
                            <button class="place-stone" on:click={() => onEmptyClick(index, index2)}>
                                <stone class:black={$currentPlayer === FieldState.Black} />
                            </button>
                        {:else}
                            <stone class:black={$boardState[index][index2] === FieldState.Black} />
                        {/if}
                    </board-item>
                {/each}
            {/each}
        </game-board>
    </inner-game-board>
</outer-game-board>

<style lang="postcss">
    outer-game-board {
        @apply flex justify-center items-center gap-4;
        @apply border border-solid border-gray-500;
        @apply bg-white;

        &.burlywood {
            @apply bg-[burlywood];
        }
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

        &:hover {
            stone {
                @apply opacity-60;
            }
        }

        stone {
            @apply opacity-0;
        }
    }

    .choose-unit {
        @apply w-full h-full cursor-pointer;
        @apply flex justify-center items-center;
        @apply bg-transparent;
    }

    stone {
        @apply w-[90%] h-[90%] rounded-full;
        @apply border-2 border-solid border-black bg-white;
        @apply flex justify-center items-center;
        z-index: 1;

        &.black {
            @apply bg-black;
        }

        &.dead {
            @apply opacity-60;
        }
        &.hovered {
            @apply opacity-60;
            @apply cursor-pointer;
        }
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