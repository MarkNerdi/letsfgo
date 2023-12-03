<script lang="ts">
    import type { Game } from '$lib/game/game';
    import { FieldState } from './enums';

    export let game: Game;

    let gameState = game.state;
    let history = game.history;
    let currentColor: FieldState = game.getCurrentColor();

    $: $history, currentColor = game.getCurrentColor();

    function onEmptyClick(x: number, y: number): void {
        game.setStone(currentColor, x, y);
    }   
</script>

<game-board style={`grid-template-columns: repeat(${game.width}, 1fr)`}>
    {#each $gameState as row, index}
        {#each row as field, index2}
            <grid-item>
                {#if field === FieldState.Empty}
                    <button on:click={() => onEmptyClick(index, index2)}>
                        <stone class:black={currentColor === FieldState.Black} />
                    </button>
                {:else}
                    <stone class:black={field === FieldState.Black} />
                {/if}
            </grid-item>
        {/each}
    {/each}
</game-board>

<style lang="scss">
    game-board {
        display: grid;
        grid-template-rows: auto;

        background-color: #3e2723;
        padding: 10px;
        border-radius: 10px;
        width: 800px;
        height: 800px;
    }

    grid-item {
        background-color: #b4ede7;
        border: 2px solid #72615f;
        box-sizing: border-box;

        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button {
        cursor: pointer;
        background-color: transparent;

        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        stone {
            opacity: 0;
        }

        &:hover {
            stone {
                opacity: 0.6;
            }
        }
    }

    stone {
        width: 90%;
        height: 90%;
        border-radius: 1000px;
        background-color: white;
        border: 3px solid black;
        display: block;

        &.black {
            background-color: black;
        }
    }
</style>
