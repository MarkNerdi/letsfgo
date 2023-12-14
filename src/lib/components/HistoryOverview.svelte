<script lang="ts">
    export let history: string[] = [];

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
            <p>{index + 1}.</p>
            <stone class:black={index % 2 === 0} />
            <p>{item}</p>

            {#if index !== history.length - 1}
                ->
            {/if}
        </div>
    {/each}
</history-overview>

<style lang="postcss">
    history-overview {
        @apply flex flex-wrap justify-start items-center gap-2;
    }

    stone {
        @apply block;
        @apply w-[20px] h-[20px] rounded-full;
        @apply border border-solid border-black bg-white;

        &.black {
            @apply bg-black;
        }
    }
</style>
