<script lang="ts">
  import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from '$lib/components/ui/table';
  import type { Lobby } from '$lib/server/lobbies/lobbies.types';

  export let lobbies: Lobby[] = [];

  function joinLobby(lobby: Lobby) {
      console.log(lobby);
  }
</script>

<Table>
    <TableHeader>
            <TableRow>
                <TableHead class="w-[100px]">Player</TableHead>
                <TableHead>Boards</TableHead>
                <TableHead class="text-right">Time</TableHead>
            </TableRow>
    </TableHeader>
    <TableBody>
        {#each lobbies as lobby}
            <TableRow on:click={() => joinLobby(lobby)} class="hover:cursor-pointer">
                <TableCell class="font-medium">{lobby.createdBy}</TableCell>
                <TableCell>{lobby.boardSizes.map(size => `${size}x${size}`).join(', ')}</TableCell>
                <TableCell class="text-right">{lobby.timeSettings.join(', ')}</TableCell>
            </TableRow>
        {/each}
    </TableBody>
</Table>