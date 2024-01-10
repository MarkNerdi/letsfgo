<script lang="ts">
    import {
        Menubar,
        MenubarContent,
        MenubarItem,
        MenubarSeparator,
        MenubarTrigger,
        MenubarMenu
    } from '$lib/components/ui/menubar';

</script>

<Menubar class="rounded-none border-b border-none px-2 lg:px-4">
	<MenubarMenu>
		<MenubarTrigger class="text-xl">Play</MenubarTrigger>
		<MenubarContent>
			<MenubarItem>Find a game</MenubarItem>
			<MenubarSeparator />
			<MenubarItem>Play with friend</MenubarItem>
			<MenubarItem>Play on device</MenubarItem>
		</MenubarContent>
	</MenubarMenu>
	<MenubarMenu>
		<MenubarTrigger class=" text-lg">Learn</MenubarTrigger>
		<MenubarContent>
			<MenubarItem>Rules</MenubarItem>
			<MenubarSeparator />
			<MenubarItem>Puzzles</MenubarItem>
			<MenubarItem>Guides</MenubarItem>
		</MenubarContent>
	</MenubarMenu>
	<MenubarMenu>
		<MenubarTrigger class="text-lg">Tools</MenubarTrigger>
		<MenubarContent>
            <MenubarItem>Analysis</MenubarItem>
			<MenubarSeparator />
			<MenubarItem>Clock</MenubarItem>
		</MenubarContent>
	</MenubarMenu>
</Menubar>