<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { ToggleGroupItem } from '$lib/components/ui/toggle-group';
    import ToggleGroup from '$lib/components/ui/toggle-group/toggle-group.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import { fetchApi } from '$lib/utils/api';

    let boardSizes: string[] = [];
    let timeSettings: string[] = [];

    async function onFindGameClick(): Promise<void> {
        try {
            await fetchApi('/api/lobby', 'POST', { boardSizes, timeSettings });
        } catch (error) {
            // TODO: Display error
        }
    }
</script>

<Card>
	<CardHeader>
		<CardTitle>How do you want to play?</CardTitle>
		<CardDescription>
			Specify board size and time settings.
		</CardDescription>
	</CardHeader>
	<CardContent class="grid gap-6">
        <ToggleGroup variant="outline" type="multiple" class="grid grid-cols-3 gap-4" bind:value={boardSizes}>
            <ToggleGroupItem value="9">
                <h3 class="text-lg font-bold">9x9</h3>
            </ToggleGroupItem>
            <ToggleGroupItem value="13">
                <h3 class="text-lg font-bold">13x13</h3>
            </ToggleGroupItem>
            <ToggleGroupItem value="19">
                <h3 class="text-lg font-bold">19x19</h3>
            </ToggleGroupItem>
        </ToggleGroup>
        <Separator />
        <ToggleGroup variant="outline" type="multiple" class="grid grid-cols-3 gap-4" bind:value={timeSettings}>
            <ToggleGroupItem value="5+5">
                <h3 class="text-lg font-bold">5+5</h3>
            </ToggleGroupItem>
            <ToggleGroupItem value="5+10">
                <h3 class="text-lg font-bold">5+10</h3>
            </ToggleGroupItem>
            <ToggleGroupItem value="5+15">
                <h3 class="text-lg font-bold">5+15</h3>
            </ToggleGroupItem>
           
            <ToggleGroupItem value="15+5">
                <h3 class="text-lg font-bold">15+5</h3>
            </ToggleGroupItem>
            <ToggleGroupItem value="15+10">
                <h3 class="text-lg font-bold">15+10</h3>
            </ToggleGroupItem>
            <ToggleGroupItem value="15+15">
                <h3 class="text-lg font-bold">15+15</h3>
            </ToggleGroupItem>
           
            <ToggleGroupItem value="25+5">
                <h3 class="text-lg font-bold">25+5</h3>
            </ToggleGroupItem>
            <ToggleGroupItem value="25+10">
                <h3 class="text-lg font-bold">25+10</h3>
            </ToggleGroupItem>
            <ToggleGroupItem value="25+15">
                <h3 class="text-lg font-bold">25+15</h3>
            </ToggleGroupItem>
        </ToggleGroup>        
	</CardContent>
	<CardFooter>
		<Button
            on:click={onFindGameClick}
            disabled={boardSizes.length === 0 || timeSettings.length === 0}
            class="w-full"
        >
            Let's GO!
        </Button>
	</CardFooter>
</Card>