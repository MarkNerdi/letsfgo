<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';
    import { ThemeSwitcher } from '$lib/components/ui/theme-switcher';
    import { activeUser } from '$lib/stores/user.store';
    import { signOut } from '@auth/sveltekit/client';

</script>

<div class="flex flex-col h-screen w-screen">
    <header>
        <a href="/">
            <h2 class="text-3xl">Let's f go</h2>
        </a>
        
        <div class="flex justify-between items-center gap-4">
            <ThemeSwitcher />
            {#if !$activeUser}
                <Button on:click={() => goto('/auth/signin')}>Sign in</Button>
            {:else}
                <Button variant="secondary" on:click={() => signOut()}>Logout</Button>
            {/if}
        </div>
    </header>

    <main class="p-5">
        <slot />
    </main>
</div>

<style lang="postcss">
    header {
        @apply h-[70px] p-4;
        @apply flex justify-between items-center gap-4;
        @apply bg-white dark:bg-black;
        @apply border-b border-solid border-border ;
    }

    main {
        @apply flex-grow w-full;
    }
</style>
