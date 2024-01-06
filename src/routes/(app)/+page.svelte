<script lang="ts">
    import { goto } from '$app/navigation';
    import CreateCustomGame from '$lib/components/CreateCustomGame.svelte';
    import CreateSession from '$lib/components/CreateSession.svelte';
    import { Button } from '$lib/components/ui/button';
    import { activeUser } from '$lib/stores/user.store';

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


</home-view>

<style lang="postcss">
    home-view {
        @apply w-full h-full;
        @apply flex flex-col justify-center items-center gap-8;
    }

    create-game-section {
        @apply flex flex-col justify-center items-center gap-4;
    }
</style>
