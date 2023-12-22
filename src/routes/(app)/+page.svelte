<script lang="ts">
    import { goto } from '$app/navigation';
    import { fetchApi } from '$lib/utils/api';

    const gameData = {
        columns: 9,
        rows: 9,
    };

    async function createGame() {
        const { gameId } = await fetchApi('/api/create-game', 'POST', gameData);
        goto(`/play/${gameId}`);
    }
</script>

<game-settings class="p-5">
    <box>
        <div class="label">Columns</div>
        <input type="number" bind:value={gameData.columns} />
    </box>
    <box>
        <div class="label">Rows</div>
        <input type="number" bind:value={gameData.rows} />
    </box>
    <button class="primary-button" on:click={createGame}>Start game</button>
</game-settings>

<style lang="postcss">
    game-settings {
        @apply w-[300px];
        @apply flex justify-center items-center gap-4;

        background-color: white;
        border: lightgrey;

        box {
            width: 100px;
        }
    }
</style>
