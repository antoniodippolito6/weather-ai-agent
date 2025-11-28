import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Questo è il pezzo magico che attiva Tailwind nei file .svelte
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter()
	}
};

export default config;