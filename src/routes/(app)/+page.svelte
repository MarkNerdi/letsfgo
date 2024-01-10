<script lang="ts">
    import { goto } from '$app/navigation';
    import CreateCustomGame from '$lib/components/CreateCustomGame.svelte';
    import CreateSession from '$lib/components/CreateSession.svelte';
    import LobbyList from '$lib/components/LobbyList.svelte';
    import { Button } from '$lib/components/ui/button';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import { Game } from '$lib/game/game';
    import type { GameSettings } from '$lib/game/types';
    import type { Lobby } from '$lib/server/lobbies/lobbies.types';
    import { offlineGame } from '$lib/stores/offline-game.store';
    import { activeUser } from '$lib/stores/user.store';
    import { fetchApi } from '$lib/utils/api';
    import { onDestroy, onMount } from 'svelte';

    let lobbies: Lobby[] = [];

    let intervalId: number | undefined = undefined;
    $: {
        clearInterval(intervalId);
        intervalId = setInterval(async () => {
            const response = await fetchApi('/api/lobby', 'GET');
            lobbies = response.lobbies;
        }, 1000);
    }

    async function createInvite(gameSettings: GameSettings): Promise<void> {
        try {
            const { inviteId } = await fetchApi('/api/invite', 'POST', gameSettings);
            goto(`/invite/${inviteId}`);
        } catch (error) {
            // TODO: Display error
        }
    }

    async function createLocalGame(gameSettings: GameSettings): Promise<void> {
        try {
            $offlineGame = new Game(gameSettings);
            console.log($offlineGame);
            goto('/play/offline');
        } catch (error) {
            // TODO: Display error
        }
    }

    onMount(async () => {
        const response = await fetchApi('/api/lobby', 'GET');
        lobbies = response.lobbies;
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>

<home-view>
    {#if $activeUser}
        <create-game-section>
            <CreateSession />
            <div class="flex flex-col gap-8">
                <CreateCustomGame
                    title={{ title: 'Play with a friend', subtitle: 'Create a game and have fun with your friend!' }}
                    button={{ label: 'Play with a friend', variant: 'default' }}
                    onCreateGameClick={(settings) => createInvite(settings)}
                />
                <CreateCustomGame
                    title={{ title: 'Play on your device', subtitle: 'Create a custom game with your own settings' }}
                    button={{ label: 'Play on your device', variant: 'outline' }}
                    onCreateGameClick={(settings) => createLocalGame(settings)}
                />
            </div>
        </create-game-section>
    {:else}
        <h1 class="text-5xl font-bold">Welcome Player!</h1>
        <h2 class="text-2xl">You're not logged in. To continue, please first create an account or log in</h2>
        <Button on:click={() => goto('/auth/signin')}>Sign in</Button>
    {/if}

    <Separator />
    <div class="w-full flex flex-col justify-left items-start gap-4 p-4">
        <h2 class="text-2xl">Active Lobbies</h2>
        <LobbyList {lobbies} />
    </div>
</home-view>

<style lang="postcss">
    home-view {
        @apply w-full h-full max-w-[1000px];
        @apply flex flex-col justify-center items-center gap-8;
    }

    create-game-section {
        @apply flex flex-row flex-shrink-0 justify-center items-center gap-4;
    }
</style>
