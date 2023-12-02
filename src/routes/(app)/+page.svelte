<script lang="ts">
  import Game from "../../lib/game/Game.svelte";

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
    <Game bind:game />
  </game-container>

  <button on:click={startNewGame}>Lets GOOOOOO</button>
</main>
