<script lang="ts">
    import type { PageData } from './$types.ts';
    import HistoryOverview from '$lib/components/HistoryOverview.svelte';
    import PlayerInfo from '$lib/components/PlayerInfo.svelte';
    import Board from '$lib/game/Board.svelte';
    import { GameStatus, PlayerColor, Scoring } from '$lib/game/enums';
    import { Game } from '$lib/game/game';

    export let data: PageData;

    let game: Game | undefined = undefined;

    $: status = game?.status;
    $: history = game?.history;
    $: currentPlayer = game?.currentPlayer;

    $: if (data.game) {
        game = Game.init(data.game);
    }

    function onAcceptDeadStonesClick(): void {
        game?.finishGame();
    }

    function onPassClick(): void {
        game?.pass();
    }
</script>

<play-view>
    <game-container>
        <player-section>
            <PlayerInfo color={PlayerColor.Black} name="Player 2" rank="2d" />
            <div>03: 03</div>
        </player-section>
        <Board bind:game />
        <player-section>
            <PlayerInfo color={PlayerColor.White} name="Player 1" rank="1d" />
            <div>03: 03</div>
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
                    <HistoryOverview history={$history} />
                </history-container>

                {#if $status === GameStatus.InProgress}
                    <form method="POST" class="controlls">
                        <input type="hidden" name="gameId" value={game.id} />
                        <input type="hidden" name="currentPlayer" value={$currentPlayer} />
                        <button class="primary" on:click={onPassClick}> Pass </button>
                        <div class="w-full flex flex-row gap-4 justify-center items-center">
                            <button on:click={() => console.log('clicked')}> Takeback </button>
                            <button formaction="?/resign"> Resign </button>
                        </div>
                    </form>
                {:else if $status === GameStatus.ChooseDeadStones}
                    <div class="controlls">
                        <h2>Choose Dead stones</h2>
                        <button class="primary" on:click={onAcceptDeadStonesClick}> Accept </button>
                    </div>
                {:else}
                    <analysis> hoi do kimmp die analyse </analysis>
                {/if}
            </game-info-box>
        {/if}

        <bottom-box>
            <form method="POST" action="?/startGame">
                <input type="hidden" name="width" value={9} />
                <input type="hidden" name="height" value={9} />
                <input type="hidden" name="initialTime" value={5} />
                <input type="hidden" name="increment" value={3} />
                <input type="hidden" name="komi" value={3} />
                <input type="hidden" name="scoring" value={Scoring.Area} />
                {#if game && $status === GameStatus.Ended}
                    <h2>
                        {game.getWinner()} won!
                    </h2>
                    <div class="w-full flex flex-row gap-4 justify-center items-center">
                        <button class="primary" formaction="?/rematch">Rematch</button>
                        <button class="primary">New opponent</button>
                    </div>
                {:else if !game}
                    <button class="primary">Lets GOOOOOO</button>
                {/if}
            </form>
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
        @apply w-[500px] h-[700px];
        @apply flex flex-col justify-center items-center gap-2;
    }

    game-info-box,
    bottom-box {
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

    game-info,
    history-container {
        @apply w-full p-4;
    }

    game-info {
        @apply flex flex-row justify-between items-center gap-4;
        @apply bg-white rounded-t-md;
    }

    history-container {
        @apply flex-grow max-h-40 overflow-y-auto;
    }

    .controlls {
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
