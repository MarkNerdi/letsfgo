<script lang="ts">
    import Stone from '$lib/components/Stone.svelte';
    import { getPlayerByTurn } from '$lib/game/utils';

    export let history: string[] = [];
    export let currentTurn: number = 0;
    export let onTurnClick: (index: number) => void = () => {};

    const keyWords = ['pass', 'resign'];

    $: formattedHistory = history.map((item) => {
        if (keyWords.includes(item)) return item;
        const [x, y] = item.split(',').map((item) => parseInt(item));
        return `${String.fromCharCode(x + 97).toUpperCase()}${y + 1}`;
    });
</script>

<history-overview>
    {#each formattedHistory as item, index}
        <div class="flex flex-row gap-1 items-center">
            <button on:click={() => onTurnClick(index + 1)} class:current={index === currentTurn - 1}>
                <p>{index + 1}.</p>
                <div class="w-[15px] h-[15px]">
                    <Stone color={getPlayerByTurn(index)} />
                </div>
                <p>{item}</p>
            </button>

            {#if index !== history.length - 1}
                ->
            {/if}
        </div>
    {/each}
</history-overview>

<style lang="postcss">
    history-overview {
        @apply flex flex-wrap justify-start items-center gap-x-1;
    }

    button {
        @apply flex flex-row gap-1 items-center justify-center;
        @apply rounded-md ;
        @apply p-1;

        &:hover, &.current {
            @apply bg-secondary;
        }
    }
    
    p {
        @apply text-sm;
    }
</style>
