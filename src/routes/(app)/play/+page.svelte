<script lang="ts">
    import PlayerInfo from '$lib/components/PlayerInfo.svelte';
    import GameComp from '$lib/game/GameComp.svelte';
    import { PlayerColor } from '$lib/game/enums';
    import { Game } from '$lib/game/game';

    let game: Game = new Game(9, 9);

    function startNewGame(): void {
        game = new Game(9, 9);
    }
</script>

<play-view>
  <game-container>
    <player-section>
        <PlayerInfo color={PlayerColor.Black} name="Player 2" rank="2d" />
        <div >
            03: 03
        </div>
    </player-section>
    <GameComp bind:game />
    <player-section>
        <PlayerInfo color={PlayerColor.White} name="Player 1" rank="1d" />
        <div >
            03: 03
        </div>
    </player-section>
  </game-container>


  <controlls-container>
      <button on:click={startNewGame}>Lets GOOOOOO</button>

  </controlls-container>
</play-view>

<style lang="postcss">
    play-view {
        @apply w-full h-full;
        @apply flex justify-center items-center;
    }

    player-section {
        @apply w-full;
        @apply flex flex-row justify-between items-center;
    }

    game-container {
        @apply h-full w-[800px];;
        @apply flex flex-col justify-center items-center gap-2;
    }
</style>
