<script lang="ts">
    export let history: string[] = [];
</script>

<history-overview>
    {#each history as item, index}
    <div class="flex flex-row gap-1 items-center">
        <stone class:black={index % 2 === 0 } />
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