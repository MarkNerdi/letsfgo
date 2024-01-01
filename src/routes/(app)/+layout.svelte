<script lang="ts">
    import { goto } from '$app/navigation';
    import { activeUser } from '$lib/stores/user.store';
    import { signOut } from '@auth/sveltekit/client';

</script>
<header>
    <div>Let's f go</div>
    
    <div>

    {#if !$activeUser}
        <button class="primary-button" on:click={() => goto('auth/signin')}>
            Login
        </button>
    {/if}

    {#if $activeUser}
        <button class="primary-button" on:click={() => signOut()}>
            Logout
        </button>
        {/if}
    </div>
</header>

<main class="p-5">
    <slot />
</main>

<style lang="postcss">
    header {
        @apply h-[70px];
        @apply flex justify-between items-center gap-4;
        @apply bg-white;
        @apply border-b border-solid border-gray-200;
    }
</style>
