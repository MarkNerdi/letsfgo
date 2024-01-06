<script lang="ts">
    import { goto } from '$app/navigation';
    import CreateCustomGame from '$lib/components/CreateCustomGame.svelte';
    import CreateSession from '$lib/components/CreateSession.svelte';
    import LobbyList from '$lib/components/LobbyList.svelte';
    import { Button } from '$lib/components/ui/button';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import type { Lobby } from '$lib/server/lobbies/lobbies.types';
    import { activeUser } from '$lib/stores/user.store';
    import { fetchApi } from '$lib/utils/api';
    import { onDestroy } from 'svelte';

    let lobbies: Lobby[] = [];

    let intervalId: number | undefined = undefined;
    $: {
        clearInterval(intervalId);
        intervalId = setInterval(async () => {
            const response = await fetchApi('/api/lobby', 'GET');
            lobbies = response.lobbies;
        }, 1000);
    }

    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>

<home-view>
    {#if $activeUser}
        <create-game-section>
            <CreateSession />
            <CreateCustomGame />
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
