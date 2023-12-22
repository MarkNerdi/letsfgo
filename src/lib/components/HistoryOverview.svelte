<script lang="ts">
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
            <button on:click={() => onTurnClick(index)} class:current={index === currentTurn}>
                <p>{index + 1}.</p>
                <stone class:black={index % 2 === 0} />
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
        @apply rounded-md hover:bg-blue-100;
        @apply p-1;

        &.current {
            @apply bg-blue-200;
        }
    }
    
    p {
        @apply text-sm;
    }

    stone {
        @apply block;
        @apply w-[15px] h-[15px] rounded-full;
        @apply border border-solid border-black bg-white;

        &.black {
            @apply bg-black;
        }
    }
</style>
