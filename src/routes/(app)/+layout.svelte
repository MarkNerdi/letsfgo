<script lang="ts">
</script>


<header>
    <div>Let's f goooo</div>
    <a href="/play">Play</a>
</header>

<div class="page-container">
    <main class="padding">
        <slot />
    </main>
</div>

<style lang="postcss">
    header {
        @apply h-[75px];
        @apply flex justify-start items-center gap-4;
        @apply bg-white;
        @apply border-b border-solid border-gray-200;
    }

    .page-container {
        @apply w-full h-full;
    }
</style>
