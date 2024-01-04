<script lang="ts">
    import { goto } from '$app/navigation';
    import { activeUser } from '$lib/stores/user.store.js';
    import { fetchApi } from '$lib/utils/api.js';
    import { share } from '$lib/utils/general.js';
    import { onDestroy } from 'svelte';

    export let data;

    $: invite = data.invite;
    $: isMyInvite = invite.createdBy === $activeUser?.id;
    async function onAcceptClick(): Promise<void> {
        try {
            await fetchApi(`/api/invite/${invite._id}/accept`, 'PUT');
            goto(`/play/${invite._id}`);
        } catch (error) {
            console.error(error);
        }
    }
    async function onDeclineClick(): Promise<void> {
        try {
            await fetchApi(`/api/invite/${invite._id}/decline`, 'PUT');
            goto('/');
        } catch (error) {
            console.error(error);
        }
    }

    function shareInviteLink(): void {
        const url = `${window.location.origin}/invite/${invite._id}`;
        share(url);
    }


    let intervalId: number | undefined = undefined;
    $: {
        clearInterval(intervalId);
        intervalId = setInterval(async () => {
            try {
                const response = await fetchApi(`/api/game/${invite._id}/game-state`, 'GET');
                if (response.success) {
                    clearInterval(intervalId);
                    goto(`/play/${invite._id}`);
                }
            } catch {
                // do nothing
            }
        }, 1000);
    }


    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>


<invite-view>
    <invite-box>
        <invite-header>
            {#if isMyInvite}
                <h2>Waiting for player to accept invite</h2>
            {:else}
                <h2>You got invited by:</h2>
                <h3>{invite.createdBy}</h3>
            {/if}
        </invite-header>

        <invite-body>
            <div class="w-full flex flex-row justify-center">
                <p class="w-1/2">Board:</p>
                <p class="w-1/2">{invite.settings.width}x{invite.settings.height}</p>
            </div>
            <div class="w-full flex flex-row justify-center">
                <p class="w-1/2">Time control:</p>
                <p class="w-1/2">{invite.settings.initialTime} + {invite.settings.increment}</p>
            </div>
            <div class="w-full flex flex-row justify-center">
                <p class="w-1/2">Komi:</p>
                <p class="w-1/2">{invite.settings.komi}</p>
            </div>
            <div class="w-full flex flex-row justify-center">
                <p class="w-1/2">Scoring:</p>
                <p class="w-1/2">{invite.settings.scoring}</p>
            </div>
        </invite-body>
        <invite-footer>
            <!-- check if invite is from current user -->
            {#if isMyInvite}
                <button class="primary-button flex-grow" on:click={shareInviteLink}>Share invite link</button>
            {:else}
                <button class="secondary-button flex-grow" on:click={onDeclineClick}>Decline</button>
                <button class="primary-button flex-grow" on:click={onAcceptClick}>Accept</button>
            {/if}
        </invite-footer>
    </invite-box>
</invite-view>


<style lang="postcss" scoped>
    invite-view {
        @apply w-full h-full;
        @apply flex justify-center items-center gap-4;
    }

    invite-box {
        @apply w-96 h-96 p-4;
        @apply flex flex-col justify-between items-center gap-4;
        @apply bg-white rounded-lg shadow-lg;

    }

    invite-header {
        @apply flex justify-center items-center;
        @apply w-full h-16;

        h2 {
            @apply text-2xl font-bold;
        }
    }

    invite-body {
        @apply flex flex-col justify-center items-center gap-4;
        @apply w-full;
    }

    invite-footer {
        @apply flex justify-center items-center gap-4;
        @apply w-full;
    }
</style>
