<script lang="ts">
    import HistoryOverview from '$lib/components/HistoryOverview.svelte';
    import PlayerInfo from '$lib/components/PlayerInfo.svelte';
    import Board from '$lib/game/Board.svelte';
    import { GameStatus, PlayerColor, ResultType } from '$lib/game/enums';
    import { browser } from '$app/environment';
    import { type Writable } from 'svelte/store';
    import type { GameResult, GameSettings } from '$lib/game/types.js';
    import { Check, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, Flag, Hand,Undo2 } from 'lucide-svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import Card from '$lib/components/ui/card/card.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import { offlineGame } from '$lib/stores/offline-game.store.js';

    let status: Writable<GameStatus> = $offlineGame.status;
    let result: Writable<GameResult | undefined> = $offlineGame.result;
    let displayedTurn: Writable<number> = $offlineGame.displayedTurn;
    let history: Writable<string[]> = $offlineGame.history; 
    let settings: GameSettings = $offlineGame.settings;
    let player = $offlineGame.currentTurn;

    $: if ($offlineGame && browser) {
        player = $offlineGame.currentTurn;
        ({ status, history, settings, displayedTurn, result } = $offlineGame);
    }

    async function onPassClick(): Promise<void> {
        $offlineGame.pass();
    }

    async function onDeadStonesAcceptClick(): Promise<void> {
        $offlineGame.status.set(GameStatus.Ended);
        // TODO: implement result   
    }

    function onKey(event: KeyboardEvent): void {
        if (event.key === 'ArrowUp') {
            $offlineGame.setDisplayedTurn('start');
        } else if (event.key === 'ArrowDown') {
            $offlineGame.setDisplayedTurn('end');
        } else if (event.key === 'ArrowLeft') {
            $offlineGame.setDisplayedTurn('previous');
        } else if (event.key === 'ArrowRight') {
            $offlineGame.setDisplayedTurn('next');
        }
    }
</script>


<svelte:window on:keydown={onKey} />

<play-view>
    <game-container>
        <player-section>
            <PlayerInfo color={PlayerColor.Black} name="Player 2" />
            <div>03:03</div>
        </player-section>
        <Board bind:game={$offlineGame} player={$player} />
        <player-section>
            <PlayerInfo color={PlayerColor.White} name="Player 1" />
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
                    onTurnClick={(index) => $offlineGame.displayedTurn.set(index)}
                />
            </history-container>
            <current-move-buttons>
                <Button variant="secondary" class="w-full" on:click={() => $offlineGame.setDisplayedTurn('start')}>
                    <ChevronsLeftIcon />
                </Button>
                <Button variant="secondary" class="w-full" on:click={() => $offlineGame.setDisplayedTurn('previous')}>
                    <ChevronLeftIcon />
                </Button>
                <Button variant="secondary" class="w-full" on:click={() => $offlineGame.setDisplayedTurn('next')}>
                    <ChevronRightIcon />
                </Button>
                <Button class="w-full" on:click={() => $offlineGame.setDisplayedTurn('end')}>
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
                <h2 class="text-3xl">{$offlineGame.getWinner()} won!</h2>
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
                    <p class="text-xl">{$offlineGame.getLooser()} resigned</p>
                {/if}
                <div class="w-full flex flex-row gap-4 justify-center items-center">
                    <Button >
                        Rematch
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
