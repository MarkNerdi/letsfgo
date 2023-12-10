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

  <side-container>
    {#if game}
        <game-info-box>
            <game-info>
                <div>Rapid - 5+0</div>
                <div>9x9</div>
                <div>23.03.2023</div>
            </game-info>
            <history-container>
                <div>History</div>
            </history-container>
            

            {#if $status !== GameStatus.Ended}
                <controlls>

                    <button class="primary" on:click={() => {
                        game?.pass($currentPlayer);
                    }}>
                        Pass
                    </button>
                    <div class="w-full flex flex-row gap-4 justify-center items-center">
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
                    </div>
                </controlls>
            {:else}
                <analysis>
                    hoi do kimmp die analyse
                </analysis>
            {/if}
        </game-info-box>
    {/if}

    <bottom-box>
        {#if game && $status === GameStatus.Ended}
            <h2>
                {game.getWinner()} won!
            </h2>
            <div class="w-full flex flex-row gap-4 justify-center items-center">
                <button class="primary" on:click={startNewGame}>Rematch</button>
                <button class="primary" on:click={startNewGame}>New opponent</button>
            </div>
        {:else if !game}
            <button class="primary" on:click={startNewGame}>Lets GOOOOOO</button>
        {/if}
    </bottom-box>
  </side-container>
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

    side-container {
        @apply w-[500px] h-full;
        @apply flex flex-col justify-center items-center gap-2;
    }

    game-info-box, bottom-box {
        @apply w-full h-full;
        @apply flex flex-col;
        @apply bg-gray-100;
        @apply border border-solid border-gray-500;
        @apply rounded-md;
    }

    game-info-box {
        @apply flex-grow;
        @apply divide-y divide-solid divide-gray-500;
    }

    bottom-box {
        @apply flex flex-col justify-center items-center gap-4;
    }

    game-info, history-container, controlls {
        @apply w-full p-4;
    }

    game-info {
        @apply flex flex-row justify-between items-center gap-4;
        @apply bg-white rounded-t-md;
    }

    history-container {
    }

    controlls {
        @apply flex flex-grow flex-col justify-center items-center gap-4;
    }

    button {
        @apply w-fit px-4 py-2 rounded-md;
        @apply bg-gray-500 text-white cursor-pointer;

        &.primary {
            @apply px-5 py-3;
            @apply bg-blue-500;
        }
    }
</style>
