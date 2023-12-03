<script lang="ts">
    import GameComp from '$lib/game/GameComp.svelte';
    import { Game } from '$lib/game/game';

    let game: Game = new Game(9, 9);

    function startNewGame(): void {
        game = new Game(9, 9);
    }
</script>

<svelte:head>
  <title>Let's f goooo</title>
</svelte:head>

<main class="padding">
  <game-container>
    <GameComp bind:game />
  </game-container>

  <button on:click={startNewGame}>Lets GOOOOOO</button>
</main>

<style lang="scss">
    game-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>