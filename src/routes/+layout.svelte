<script lang="ts">
    import { windowWidth } from '$lib/stores/window.store.ts';
    import { onMount } from 'svelte';
    import '../app.css';

    onMount(() => {
        $windowWidth = window.innerWidth;
        window.addEventListener('resize', () => ($windowWidth = window.innerWidth));
    });
</script>

<div class="app">
    <slot />
</div>

<style lang="postcss">
    .app {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
