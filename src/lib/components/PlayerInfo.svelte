<script lang="ts">
    import Stone from '$lib/components/Stone.svelte';
    import { PlayerColor } from '$lib/game/enums';

    export let color: PlayerColor;
    export let name: string;
    export let rank: string;
</script>

<player-info>
    <div class="w-[35px] h-[35px]">
        <Stone {color} />
    </div>
    <p>{name} · {rank}</p>
</player-info>

<style lang="postcss">
    player-info {
        @apply flex flex-row justify-center items-center gap-2;
    }
</style>
