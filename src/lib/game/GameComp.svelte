<script lang="ts">
    import EmptyBoard from '$lib/game/EmptyBoard.svelte';
import type { Game } from '$lib/game/game';
    import { FieldState } from './enums';

    export let game: Game | undefined;
    export let color: 'burlywood' | 'white' = 'white';

    $: gameState = game?.boardState;
    $: currentPlayer = game?.currentPlayer;

    function onEmptyClick(x: number, y: number): void {
        if (!game || !currentPlayer) return;
        game.setStone($currentPlayer, x, y);
    }   
</script>

<EmptyBoard width={game?.width} height={game?.height} {color} let:index let:index2>
    <grid-item slot="field" class="h-full w-full">
        {#if !gameState || !$gameState}
            <!-- empty -->
        {:else if $gameState[index][index2] === FieldState.Empty}
            <button on:click={() => onEmptyClick(index, index2)}>
                <stone class:black={$currentPlayer === FieldState.Black} />
            </button>
        {:else}
            <stone class:black={$gameState[index][index2] === FieldState.Black} />
        {/if}
    </grid-item>
</EmptyBoard>

<style lang="postcss">

    grid-item {
        @apply w-full h-full;
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
</style>
