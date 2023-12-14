<script lang="ts">
    import EmptyBoard from '$lib/game/EmptyBoard.svelte';
    import type { Game } from '$lib/game/game';
    import type { Stone } from '$lib/game/types';
    import { getEvaluatedBoardState, getUnitContainingCoordinates } from '$lib/game/utils';
    import { FieldState, GameStatus } from './enums';

    export let game: Game | undefined;
    export let color: 'burlywood' | 'white' = 'white';

    $: boardState = game?.boardState;
    $: cleanedBoardState = game?.cleanedBoardState;
    $: currentPlayer = game?.currentPlayer;
    $: deadStones = game?.deadStones;
    $: gameStatus = game?.status;

    $: evaluatedBoardState =
        cleanedBoardState && $cleanedBoardState && $gameStatus === GameStatus.ChooseDeadStones
            ? getEvaluatedBoardState($cleanedBoardState)
            : undefined;

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

<EmptyBoard width={game?.width} height={game?.height} {color} let:index let:index2>
    <grid-item class="h-full w-full">
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
                    {@const isHovered = hoveredUnit?.some((stone) => stone.x === index && stone.y === index2)}
                    {@const isDead = $deadStones?.some((stone) => stone.x === index && stone.y === index2)}
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
    </grid-item>
</EmptyBoard>

<style lang="postcss">
    grid-item {
        @apply w-full h-full relative;
        @apply flex justify-center items-center;
    }

    .place-stone {
        @apply w-full h-full cursor-pointer;
        @apply flex justify-center items-center;
        @apply bg-transparent;

        stone {
            @apply opacity-0;
        }

        &:hover {
            stone {
                @apply opacity-60;
            }
        }
    }

    .choose-unit {
        @apply w-full h-full cursor-pointer;
        @apply flex justify-center items-center;
    }

    stone {
        @apply w-5/6 h-5/6 rounded-full;
        @apply border-2 border-solid border-black bg-white;
        @apply flex justify-center items-center;

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
