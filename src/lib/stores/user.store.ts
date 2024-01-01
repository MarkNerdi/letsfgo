import { page } from '$app/stores';
import { derived } from 'svelte/store';

export const activeUser = derived([page], ([page]) => page.data.session?.user ?? null);
