<script lang="ts">
    import { PlayerColor } from '$lib/game/enums';

    export let color: PlayerColor = PlayerColor.Black;
</script>

<stone class:black={color === PlayerColor.Black} class="{color === PlayerColor.Black ? 'black' : 'white'}" >
    <slot />
</stone>

<style lang="postcss">
    stone {
        @apply w-[90%] h-[90%];
        @apply flex justify-center items-center;
        @apply rounded-full;

        &.white {
            background: radial-gradient(circle at 24.1% 68.8%, rgb(241, 241, 242) 0.1%, rgb(188, 192, 197) 100.2%);
        }

        &.black {
            background: radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%);
        }
    }
</style>
