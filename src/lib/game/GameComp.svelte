<script lang="ts">
    import EmptyBoard from '$lib/game/EmptyBoard.svelte';
    import type { Game } from '$lib/game/game';
    import type { Stone } from '$lib/game/types';
    import { getEvaluatedBoardState, getUnitContainingCoordinates } from '$lib/game/utils';
    import { FieldState, GameStatus } from './enums';

    export let game: Game | undefined;
    export let color: 'burlywood' | 'white' = 'white';

    $: boardState = game?.boardState;
    $: currentPlayer = game?.currentPlayer;
    $: gameStatus = game?.status;
    $: evaluatedBoardState = (boardState && $boardState && $gameStatus === GameStatus.ChooseDeadStones) ? getEvaluatedBoardState($boardState) : undefined;

    function onEmptyClick(x: number, y: number): void {
        if (!game || !currentPlayer) return;
        game.setStone($currentPlayer, x, y);
    }
    

    let hoveredCoordinate: Stone | undefined = undefined;

    $: hoveredUnit = (hoveredCoordinate && $boardState) ? getUnitContainingCoordinates(hoveredCoordinate?.x, hoveredCoordinate?.y, $boardState) : undefined;
    let deadUnits = [];

    function onUnitClick(x: number, y: number): void {
        if (!game || !currentPlayer) return;
        game.setStone($currentPlayer, x, y);
    }   

    $: console.log(evaluatedBoardState);
    
</script>

<EmptyBoard width={game?.width} height={game?.height} {color} let:index let:index2>
    <grid-item slot="field" class="h-full w-full" on:mouseleave={() => hoveredCoordinate = undefined} on:mouseenter={() => hoveredCoordinate = { x: index, y: index2 }}>
        {#if !boardState || !$boardState}
            <!-- empty -->
        {:else if $boardState[index][index2] === FieldState.Empty}
            {#if $gameStatus === GameStatus.Ended}
                <!-- empty -->
            {:else}
                <button on:click={() => onEmptyClick(index, index2)}>
                    <stone class:black={$currentPlayer === FieldState.Black} />
                </button>
            {/if}
        {:else}
            <stone class:black={$boardState[index][index2] === FieldState.Black} />
        {/if}

        {#if evaluatedBoardState && evaluatedBoardState[index][index2] !== FieldState.Empty}
            <overlay>
                <evaluated-field class:black={evaluatedBoardState[index][index2] === FieldState.Black}/> 
            </overlay>
        {/if}
    </grid-item>
</EmptyBoard>

<style lang="postcss">

    grid-item {
        @apply w-full h-full relative;
        @apply flex justify-center items-center;
    }

    button {
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

    stone {
        @apply block;
        @apply w-5/6 h-5/6 rounded-full;
        @apply border-2 border-solid border-black bg-white;

        &.black {
            @apply bg-black;
        }
    }

    overlay {
        @apply w-full h-full absolute top-0 left-0;
        @apply flex justify-center items-center;
    }

    evaluated-field {
        @apply w-3/12 h-1/4;
        @apply flex justify-center items-center;
        @apply bg-white;
        @apply border-2 border-solid border-black;

        &.black {
            @apply bg-black;
            @apply border-white;
        }
    }
</style>
