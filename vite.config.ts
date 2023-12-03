import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        sveltekit(),
    ],
    server: {
        fs: {
            allow: ['static'], // This allows files one level up from the project root
        },
    },
});
