<script lang="ts">
    import { PlayerColor } from '$lib/game/enums';

    export let color: PlayerColor;
    export let name: string;
    export let rank: string;
</script>

<player-info>
    <stone class:black={color === PlayerColor.Black} />
    <p>{name} · {rank}</p>
</player-info>

<style lang="postcss">
    player-info {
        @apply flex flex-row justify-center items-center gap-2;
    }

    stone {
        @apply block;
        @apply w-[30px] h-[30px] rounded-full;
        @apply border border-solid border-black bg-white;

        &.black {
            @apply bg-black;
        }
    }
</style>
