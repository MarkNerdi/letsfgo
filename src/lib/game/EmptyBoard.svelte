<script lang="ts">
    export let width = 9;
    export let height = 9;
    export let color: 'burlywood' | 'white' = 'white';
</script>

<game class:burlywood={color === 'burlywood'}>
    <game-board style={`grid-template-columns: repeat(${width}, 1fr)`}>
        {#each Array(width) as _, index}
            {#each Array(height) as _, index2}
                <grid-item>
                    <slot name="field" index={index} index2={index2} />
                </grid-item>
            {/each}
        {/each}
    </game-board>
</game>

<style lang="postcss">
    game {
        @apply flex justify-center items-center gap-4;
        @apply h-[800px] w-[800px] p-16 rounded-xl;
        @apply border border-solid border-gray-500;
        @apply bg-white;

        &.burlywood {
            @apply bg-[burlywood];
        }
    }

    game-board {
        @apply w-full h-full;
        @apply border border-solid border-gray-500;
        display: grid;
        grid-template-rows: auto;
    }

    grid-item {
        @apply border border-solid border-gray-500;
        @apply w-full h-full box-border;
    }
</style>
