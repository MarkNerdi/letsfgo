<script lang="ts">
    import HistoryOverview from '$lib/components/HistoryOverview.svelte';
    import PlayerInfo from '$lib/components/PlayerInfo.svelte';
    import Board from '$lib/game/Board.svelte';
    import { GameStatus, PlayerColor } from '$lib/game/enums';
    import { Game } from '$lib/game/game';
    import { browser } from '$app/environment';
    import { get, readable, type Writable } from 'svelte/store';
    import type { GameSettings } from '$lib/game/types.js';
    import { onDestroy } from 'svelte';

    export let data;

    let game: Game = Game.init(data.game);
    let status: Writable<GameStatus> = game.status;
    let displayedTurn: Writable<number> = game.displayedTurn;
    let history: Writable<string[]> = game.history; 
    let settings: GameSettings = game.settings;
    let player = data.player ? readable(data.player === 'black' ? PlayerColor.Black : PlayerColor.White) : game.currentTurn;

    $: if (data.game && browser) {
        game = Game.init(data.game);
        player = data.player ? readable(data.player === 'black' ? PlayerColor.Black : PlayerColor.White) : game.currentTurn;
        ({ status, history, settings, displayedTurn } = game);
    }

    async function onPassClick(): Promise<void> {
        if (!game) return;

        game.pass();

        await fetch(`/api/game/${game.id}/add-move`, {
            method: 'POST',
            body: JSON.stringify({
                action: 'pass',
            }),
        }).catch(err => console.error(err));
    }

    async function onDeadStonesAcceptClick(): Promise<void> {
        if (!game) return;

        await fetch(`/api/game/${game.id}/set-dead-stones`, {
            method: 'POST',
            body: JSON.stringify({
                stones: get(game.deadStones),
                player: $player,
            }),
        }).catch(err => console.error(err));

        if (!data.player) {
            await fetch(`/api/game/${game.id}/set-dead-stones`, {
                method: 'POST',
                body: JSON.stringify({
                    stones: get(game.deadStones),
                    player: $player === PlayerColor.Black ? PlayerColor.White : PlayerColor.Black,
                }),
            }).catch(err => console.error(err));
        }
    }

    function onKey(event: KeyboardEvent): void {
        if (!game) return;

        if (event.key === 'ArrowUp') {
            game.setDisplayedTurn('start');
        } else if (event.key === 'ArrowDown') {
            game.setDisplayedTurn('end');
        } else if (event.key === 'ArrowLeft') {
            game.setDisplayedTurn('previous');
        } else if (event.key === 'ArrowRight') {
            game.setDisplayedTurn('next');
        }
    }

    let intervalId: number | undefined = undefined;
    $: {
        clearInterval(intervalId);
        intervalId = setInterval(async () => {
            if (!game) {
                return;
            }

            const gameInfo = await fetch(`/api/game/${game.id}/game-state`, { method: 'GET' });
            if (!gameInfo.ok) {
                return;
            }
            const data = await gameInfo.json();
            const { history, status, result } = data.gameState;

            game.updateHistory(history);
            game.status.set(status);
            game.result.set(result);
        }, 1000);
    }

    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>


<svelte:window on:keydown={onKey} />

<play-view>
    <game-container>
        <player-section>
            <PlayerInfo color={PlayerColor.Black} name="Player 2" rank="2d" />
            <div>03:03</div>
        </player-section>
        <Board bind:game {player} />
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
                <HistoryOverview
                    history={$history}
                    currentTurn={$displayedTurn}
                    onTurnClick={(index) => game.displayedTurn.set(index)}
                />
            </history-container>
             <current-move-buttons>
                <button on:click={() => game.setDisplayedTurn('start')}>Start</button>
                <button on:click={() => game.setDisplayedTurn('previous')}>Previous</button>
                <button on:click={() => game.setDisplayedTurn('next')}>Next</button>
                <button
                    class="primary"
                    on:click={() => game.setDisplayedTurn('end')}
                >
                    {GameStatus.InProgress ? 'Current' : 'End'}
                </button>
            </current-move-buttons>
            {#if $status === GameStatus.InProgress}
                <controlls>
                    <button class="primary" on:click={onPassClick}>Pass</button>
                    <div class="w-full flex flex-row gap-4 justify-center items-center">
                        <button>Takeback</button>
                        <button formaction="?/resign">Resign</button>
                    </div>
                </controlls>
            {:else if $status === GameStatus.ChooseDeadStones}
                <controlls>
                    <h2>Choose Dead stones</h2>
                    <button class="primary" on:click={onDeadStonesAcceptClick}> Accept </button>
                </controlls>
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

<style lang="postcss" scoped>
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

    current-move-buttons {
        @apply flex flex-row justify-between items-center gap-1 p-1;
        @apply bg-white;

        button {
            @apply w-full;
        }
    }

    controlls {
        @apply flex flex-grow flex-col justify-center items-center gap-4 p-4;
    }

    button {
        @apply w-fit px-4 py-2 rounded-md;
        @apply bg-gray-500 text-white cursor-pointer;

        &.primary {
            @apply bg-blue-500;
        }
    }
</style>
