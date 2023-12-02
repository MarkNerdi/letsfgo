<script lang="ts">
    import { windowWidth } from '$lib/stores/window.store.ts';
    import { onMount } from 'svelte';
    import '$lib/style/global.scss';
    import Toast from '$lib/components/Toast.svelte';
    import { isDesktop } from '$lib/stores/window.store.ts';
    import '$lib/style/global.scss';

    onMount(() => {
        $windowWidth = window.innerWidth;
        window.addEventListener('resize', () => ($windowWidth = window.innerWidth));
    });
</script>

<div class="app" class:desktop={$isDesktop}>
    <slot />
    <Toast />
    
</div>

<style lang="scss">
    .app {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: white;

        &.desktop {
            width: 1000px;
            height: calc(100% - 100px);
            margin: auto;
            margin-top: 50px;
            margin-bottom: 50px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        }
    }
</style>
