<script lang="ts">
    import GameComp from '$lib/game/GameComp.svelte';
    import { Game } from '$lib/game/game';

    let game: Game = new Game(9, 9);

    function startNewGame(): void {
        game = new Game(9, 9);
    }
</script>

<play-view>
  <game-container>
    <GameComp bind:game />
  </game-container>

  <button on:click={startNewGame}>Lets GOOOOOO</button>
</play-view>

<style lang="postcss">
    game-container {
        @apply w-full h-full;
        @apply flex justify-center items-center;
    }
</style>
