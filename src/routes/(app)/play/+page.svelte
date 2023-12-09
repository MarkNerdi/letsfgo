<script lang="ts">
    import PlayerInfo from '$lib/components/PlayerInfo.svelte';
    import GameComp from '$lib/game/GameComp.svelte';
    import { GameStatus, PlayerColor } from '$lib/game/enums';
    import { Game } from '$lib/game/game';

    let game: Game | undefined = undefined;

    function startNewGame(): void {
        game = new Game(9, 9);
    }

    $: status = game?.status;
    $: currentPlayer = game?.currentPlayer;
</script>

<play-view>
  <game-container>
    <player-section>
        <PlayerInfo color={PlayerColor.Black} name="Player 2" rank="2d" />
        <div >
            03: 03
        </div>
    </player-section>
    <GameComp bind:game />
    <player-section>
        <PlayerInfo color={PlayerColor.White} name="Player 1" rank="1d" />
        <div >
            03: 03
        </div>
    </player-section>
  </game-container>

  <controlls-container>
        {#if game && $status === GameStatus.Ended}
            <h2>
                {game.getWinner()} won!
            </h2>
        {/if}
        {#if game && $status !== GameStatus.Ended}
            <button-container>
                <button on:click={() => {
                    console.log('clicked');
                }}>
                    Takeback
                </button>
                <button on:click={() => {
                    console.log('clicked');
                }}>
                    Surrender
                </button>
                <button on:click={() => {
                    game?.pass($currentPlayer);
                }}>
                    Pass
                </button>
            </button-container>
        {:else}
            <button class="primary" on:click={startNewGame}>Lets GOOOOOO</button>
        {/if}
  </controlls-container>
</play-view>

<style lang="postcss">
    play-view {
        @apply w-full h-full;
        @apply flex justify-center items-center gap-4;
    }

    player-section {
        @apply w-full;
        @apply flex flex-row justify-between items-center;
    }

    game-container {
        @apply h-full w-[800px];
        @apply flex flex-col justify-center items-center gap-2;
    }

    controlls-container {
        @apply w-[500px] h-full p-8;
        @apply flex flex-col justify-center items-center gap-2;
        @apply bg-gray-300;
    }

    button-container {
        @apply w-full;
        @apply flex flex-row justify-between items-center gap-4;
    }

    button {
        @apply w-full h-16 rounded-md;
        @apply bg-gray-500 text-white cursor-pointer;

        &.primary {
            @apply bg-blue-500;
        }
    }
</style>
