<script lang="ts">
    import { goto } from '$app/navigation';

    export let title: string;
    export let routes: { name: string; path: string }[];

    let dialog: HTMLDialogElement;
</script>

<svelte:document on:click={() => {
    if (dialog.open) {
        dialog.close();
    }
}} />

<menu-item>
    <button on:click|stopPropagation={() => dialog.show()}>
        <p>{title}</p>
    </button>

    <dialog bind:this={dialog}>
        <dialog-content>
            {#each routes as route}
                <button on:click={() => goto(route.path)}>
                    <p>{route.name}</p>
                </button>
            {/each}
        </dialog-content>
    </dialog>
</menu-item>


<style lang="postcss">
    menu-item {
        @apply relative;
    }

    p {
        @apply h-10;
        @apply text-base text-gray-700;
        @apply flex justify-start items-center;
    }

    dialog {
        @apply absolute top-10 left-0 bg-white;
        @apply border border-solid border-gray-200;
        @apply z-50 rounded-md;
    }

    dialog-content {
        @apply flex flex-col justify-center items-center gap-4 py-2 px-4;
    }

    button {
        @apply w-full;
    }
</style>
