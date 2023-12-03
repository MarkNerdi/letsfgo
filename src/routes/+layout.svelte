<script lang="ts">
    import { windowWidth } from '$lib/stores/window.store.ts';
    import { onMount } from 'svelte';
    import '$lib/style/global.scss';
    import { isDesktop } from '$lib/stores/window.store.ts';
    import '$lib/style/global.scss';

    onMount(() => {
        $windowWidth = window.innerWidth;
        window.addEventListener('resize', () => ($windowWidth = window.innerWidth));
    });
</script>

<div class="app" class:desktop={$isDesktop}>
    <slot />
</div>

<style lang="scss">
    .app {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        &.desktop {
            width: 1000px;
            height: calc(100% - 100px);
            margin: auto;
            margin-top: 50px;
            overflow: hidden;
        }
    }
</style>
