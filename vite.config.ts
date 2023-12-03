import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
    plugins: [
        sveltekit(),
        viteStaticCopy({
            targets: [
                {
                    src: path.resolve(__dirname, './static') + '/[!.]*', // 1️⃣
                    dest: './', // 2️⃣
                },
            ],
        }),
    ],
    server: {
        fs: {
            allow: ['static'], // This allows files one level up from the project root
        },
    },
});
