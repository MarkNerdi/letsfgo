<script lang="ts">
    import { Button, buttonVariants } from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import { Select, SelectGroup, SelectTrigger, SelectContent, SelectItem, SelectValue } from '$lib/components/ui/select';
    import { ToggleGroup, ToggleGroupItem } from '$lib/components/ui/toggle-group';
    import { Scoring } from '$lib/game/enums';
    import type { GameSettings } from '$lib/game/types';
    import { fetchApi } from '$lib/utils/api';
    import { goto } from '$app/navigation';

    let scoring = { value: Scoring.Area, label: 'Area' };
    let boardSize = '9';
    let initialTime = 15;
    let minTimePerTurn = 15;
    let komi = 5.5;

    async function createGame(): Promise<void> {
        const gameSettings: GameSettings = {
            width: parseInt(boardSize),
            height: parseInt(boardSize),
            initialTime,
            increment: minTimePerTurn,
            komi,
            scoring: scoring.value,
        };
        try {
            const { inviteId } = await fetchApi('/api/invite', 'POST', gameSettings);
            goto(`/invite/${inviteId}`);
        } catch (error) {
            // TODO: Display error
        }
    }
</script>

<Dialog.Root>
    <Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
        Play with a friend
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Play with a friend</Dialog.Title>
            <Dialog.Description>
                Create a game and have fun with your friend!
            </Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <h4 class="text-base font-bold">Board</h4>
            <ToggleGroup size="lg" type="single" bind:value={boardSize} >
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
            <h4 class="text-base font-bold">Time</h4>
            <div class="flex items-center justify-center gap-4">
                <div class="flex flex-col gap-2">
                    <Input bind:value={initialTime} class="col-span-3" />
                    <Label >Start time (in min)</Label>
                </div>
                <div class="flex flex-col gap-2">
                    <Input bind:value={minTimePerTurn} class="col-span-3" />
                    <Label >Min. time per turn (in sec)</Label>
                </div>
            </div>
            <Separator />
            <h4 class="text-base font-bold">Advanced</h4>

            <div class="flex items-center justify-center gap-4">
                <div class="flex flex-col gap-2">
                    <Input bind:value={komi} class="col-span-3" />
                    <Label >Komi</Label>
                </div>
                <div class="flex flex-col gap-2">
                    <Select portal={null} bind:selected={scoring}>
                        <SelectTrigger class="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={Scoring.Area} label="Area">
                                    Area
                                </SelectItem>
                                <SelectItem value={Scoring.Territory} label="Territory">
                                    Territory
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Label >Scoring</Label>
                </div>
            </div>
        </div>
        <Dialog.Footer>
            <Button on:click={createGame}>Create Game</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>