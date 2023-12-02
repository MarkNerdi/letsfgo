<script lang="ts">
  import type { TabItem } from "$lib/components/component.types.ts";
  import { page } from "$app/stores";
  import { FieldState } from "./enums";

  export let game: Game;

  function onEmptyClick(x: number, y: number): void {
    game.setStone(x, y, FieldState.Black);
  }
</script>

<game-board>
  {#each game.state as row, index}
    {#each row as field, index2}
      {#if field === FieldState.Empty}
        <button on:click={() => onEmptyClick(index2, index)} />
      {:else}
        <stone class:black={field === FieldState.Black} />
      {/if}
    {/each}
  {/each}
</game-board>

<style lang="scss">
  game {
    width: 100%;
    height: 100%;
  }

  stone {
    width: 100%;
    height: 100%;
    border-radius: 1000px;
    background-color: white;
    border: 3px solid black;

    &.black {
      background-color: black;
    }
  }
</style>
