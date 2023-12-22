<header>
    <div>Let's f go</div>
</header>

<main class="p-5">
    <slot />
</main>

<style lang="postcss">
    header {
        @apply h-[70px];
        @apply flex justify-start items-center gap-4;
        @apply bg-white;
        @apply border-b border-solid border-gray-200;
    }
</style>
