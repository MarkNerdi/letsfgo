<script lang="ts">
    import { windowWidth } from '$lib/stores/window.store.ts';
    import { onMount } from 'svelte';
    import '../app.css';

    onMount(() => {
        $windowWidth = window.innerWidth;
        window.addEventListener('resize', () => ($windowWidth = window.innerWidth));
    });
</script>

<slot />
