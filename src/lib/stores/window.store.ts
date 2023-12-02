import { derived, writable } from 'svelte/store';

export const windowWidth = writable(0);

export const isMobile = derived(windowWidth, $windowWidth => $windowWidth < 700);
export const isTablet = derived(windowWidth, $windowWidth => $windowWidth < 1000);
export const isDesktop = derived(windowWidth, $windowWidth => $windowWidth >= 1000);

