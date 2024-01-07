<script lang="ts">
    import HistoryOverview from '$lib/components/HistoryOverview.svelte';
    import PlayerInfo from '$lib/components/PlayerInfo.svelte';
    import Board from '$lib/game/Board.svelte';
    import { GameStatus, PlayerColor, ResultType } from '$lib/game/enums';
    import { Game } from '$lib/game/game';
    import { browser } from '$app/environment';
    import { get, type Writable } from 'svelte/store';
    import type { GameResult, GameSettings } from '$lib/game/types.js';
    import { onDestroy } from 'svelte';
    import { fetchApi } from '$lib/utils/api.js';
    import { Check, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, Flag, Hand,Undo2 } from 'lucide-svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import Card from '$lib/components/ui/card/card.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import { activeUser } from '$lib/stores/user.store.js';

    export let data;

    let game: Game = Game.init(data.game);
    let status: Writable<GameStatus> = game.status;
    let result: Writable<GameResult | undefined> = game.result;
    let displayedTurn: Writable<number> = game.displayedTurn;
    let history: Writable<string[]> = game.history; 
    let settings: GameSettings = game.settings;
    let player = $activeUser === game.blackPlayer ? PlayerColor.Black : $activeUser === game.whitePlayer ? PlayerColor.White : undefined;

    $: if (data.game && browser) {
        game = Game.init(data.game);
        player = $activeUser === game.blackPlayer ? PlayerColor.Black : $activeUser === game.whitePlayer ? PlayerColor.White : undefined;
        ({ status, history, settings, displayedTurn, result } = game);
    }

    async function onPassClick(): Promise<void> {
        if (!game) return;

        game.pass();

        await fetchApi(`/api/game/${game.id}/add-move`,
            'POST',
            { action: 'pass' }
        ).catch(err => console.error(err));
    }

    async function onDeadStonesAcceptClick(): Promise<void> {
        if (!game || !player) return;

        await fetchApi(`/api/game/${game.id}/set-dead-stones`,
            'POST', 
            {
                stones: get(game.deadStones),
            }
        ).catch(err => console.error(err));
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
        <Card class="w-full h-full flex flex-col justify-center items-center gap-4">
            <game-info>
                <div>Rapid - {settings.initialTime}+{settings.increment}</div>
                <div>{settings.width}x{settings.height}</div>
                <div>23.03.2023</div>
            </game-info>
            <Separator />
            <history-container>
                <HistoryOverview
                    history={$history}
                    currentTurn={$displayedTurn}
                    onTurnClick={(index) => game.displayedTurn.set(index)}
                />
            </history-container>
            <current-move-buttons>
                <Button variant="secondary" class="w-full" on:click={() => game.setDisplayedTurn('start')}>
                    <ChevronsLeftIcon />
                </Button>
                <Button variant="secondary" class="w-full"  on:click={() => game.setDisplayedTurn('previous')}>
                    <ChevronLeftIcon />
                </Button>
                <Button variant="secondary" class="w-full"  on:click={() => game.setDisplayedTurn('next')}>
                    <ChevronRightIcon />
                </Button>
                <Button class="w-full"  on:click={() => game.setDisplayedTurn('end')}>
                    <ChevronsRightIcon />
                </Button>
            </current-move-buttons>
            <Separator />
            {#if $status === GameStatus.InProgress}
                <controlls>
                    <Button class="w-full" on:click={onPassClick}>
                        <Hand class="mr-2 h-4 w-4" />
                        Pass
                    </Button>
                    <div class="w-full flex flex-row gap-4 justify-center items-center">
                        <Button variant="secondary" class="w-full">
                            <Undo2 class="mr-2 h-4 w-4" />
                            Takeback
                        </Button>
                        <Button variant="secondary" class="w-full">
                            <Flag class="mr-2 h-4 w-4" />
                            Resign
                        </Button>
                    </div>
                </controlls>
            {:else if $status === GameStatus.ChooseDeadStones}
                <controlls>
                    <h2 class="text-2xl">Choose Dead stones!</h2>
                    <Button class="w-full" on:click={onDeadStonesAcceptClick}>
                        <Check class="mr-2 h-4 w-4" />
                        Accept
                    </Button>
                </controlls>
            {:else}
                <analysis>hoi do kimmp die analyse</analysis>
            {/if}
        </Card>
        <Card class="w-full h-full flex flex-col justify-center items-center gap-4">
            {#if $status === GameStatus.Ended && $result}
                <h2 class="text-3xl">{game.getWinner()} won!</h2>
                {#if $result.type === ResultType.Score}
                    <div class="flex gap-4">
                        <Card class="flex flex-col items-center py-4 px-6">
                            <h4 class="text-2xl font-bold">{$result.points.black}</h4>
                            Black
                        </Card>
                        <Card class="flex flex-col items-center py-4 px-6">
                            <div class="flex items-center gap-1">
                                <h4 class="text-2xl font-bold">{$result.points.white - settings.komi}</h4>
                                <p class="text-base">+{settings.komi}</p>
                            </div>
                            White
                        </Card>
                    </div>
                {:else if $result.type === ResultType.Resign}
                    <p class="text-xl">{game.getLooser()} resigned</p>
                {/if}
                <div class="w-full flex flex-row gap-4 justify-center items-center">
                    <Button >
                        Rematch
                    </Button>
                    <Button>
                        New opponent
                    </Button>
                </div>
            {/if}
        </Card>

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

    game-info,
    history-container {
        @apply w-full px-4;
    }

    game-info {
        @apply flex flex-row justify-between items-center gap-4;
        @apply rounded-t-md pt-4;
    }

    history-container {
        @apply flex-grow max-h-40 overflow-y-auto;
    }

    current-move-buttons {
        @apply w-full flex flex-row justify-between items-center gap-1 p-1;
    }

    controlls {
        @apply w-full flex flex-grow flex-col justify-center items-center gap-4 p-4;
    }
</style>
