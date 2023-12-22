<script lang="ts">
    import HistoryOverview from '$lib/components/HistoryOverview.svelte';
    import PlayerInfo from '$lib/components/PlayerInfo.svelte';
    import Board from '$lib/game/Board.svelte';
    import { GameStatus, PlayerColor } from '$lib/game/enums';
    import { Game } from '$lib/game/game';
    import { browser } from '$app/environment';
    import type { Writable } from 'svelte/store';
    import type { GameSettings } from '$lib/game/types.js';

    export let data;

    let game: Game = Game.init(data.game);
    let status: Writable<GameStatus> = game.status;
    let history: Writable<string[]> = game.history; 
    let settings: GameSettings = game.settings;
    let finishGame: () => void = game.finishGame;

    $: if (data.game && browser) {
        game = Game.init(data.game);
        ({ status, history, settings, finishGame } = game);
    }

    async function onPassClick(): Promise<void> {
        if (!game) return;

        game.pass();

        await fetch('/api/game/add-move', {
            method: 'POST',
            body: JSON.stringify({
                gameId: game.id,
                pass: true,
            }),
        }).catch(err => console.error(err));
    }
</script>

<play-view>
    <game-container>
        <player-section>
            <PlayerInfo color={PlayerColor.Black} name="Player 2" rank="2d" />
            <div>03:03</div>
        </player-section>
        <Board bind:game />
        <player-section>
            <PlayerInfo color={PlayerColor.White} name="Player 1" rank="1d" />
            <div>03:03</div>
        </player-section>
    </game-container>

    <side-container>
        <game-info-box>
            <game-info>
                <div>Rapid - {settings.initialTime}+{settings.increment}</div>
                <div>{settings.width}x{settings.height}</div>
                <div>23.03.2023</div>
            </game-info>
            <history-container>
                <HistoryOverview history={$history} />
            </history-container>
            {#if $status === GameStatus.InProgress}
                <form method="POST" class="controlls">
                    <button class="primary" on:click={onPassClick}>Pass</button>
                    <div class="w-full flex flex-row gap-4 justify-center items-center">
                        <button>Takeback</button>
                        <button formaction="?/resign">Resign</button>
                    </div>
                </form>
            {:else if $status === GameStatus.ChooseDeadStones}
                <div class="controlls">
                    <h2>Choose Dead stones</h2>
                    <button class="primary" on:click={finishGame}> Accept </button>
                </div>
            {:else}
                <analysis>hoi do kimmp die analyse</analysis>
            {/if}
        </game-info-box>

        <!-- Todo: Remove form -->
        <bottom-box>
            <form method="POST" action="?/startGame">
                {#if $status === GameStatus.Ended}
                    <h2>
                        {game.getWinner()} won!
                    </h2>
                    <div class="w-full flex flex-row gap-4 justify-center items-center">
                        <button class="primary" formaction="?/rematch">Rematch</button>
                        <button class="primary">New opponent</button>
                    </div>
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
