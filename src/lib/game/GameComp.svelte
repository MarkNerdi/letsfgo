<script lang="ts">
    import type { Game } from '$lib/game/game';
    import { FieldState } from './enums';

    export let game: Game;

    $: gameState = game.boardState;
    $: currentPlayer = game.currentPlayer;

    function onEmptyClick(x: number, y: number): void {
        game.setStone($currentPlayer, x, y);
    }   
</script>

<game-board style={`grid-template-columns: repeat(${game.width}, 1fr)`}>
    {#each $gameState as row, index}
        {#each row as field, index2}
            <grid-item>
                {#if field === FieldState.Empty}
                    <button on:click={() => onEmptyClick(index, index2)}>
                        <stone class:black={$currentPlayer === FieldState.Black} />
                    </button>
                {:else}
                    <stone class:black={field === FieldState.Black} />
                {/if}
            </grid-item>
        {/each}
    {/each}
</game-board>

<style lang="postcss">
    game-board {
        @apply p-3 rounded-md;
        @apply bg-[#3e2723];

        display: grid;
        grid-template-rows: auto;
        height: 800px;
        width: 800px;
    }

    grid-item {
        @apply bg-[#b4ede7] border border-solid border-[#72615f];
        @apply w-full h-full box-border;
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
        @apply border border-solid border-black bg-white;

        &.black {
            @apply bg-black;
        }
    }
</style>
