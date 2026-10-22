import nodeAdapter from '@sveltejs/adapter-node';
import netlifyAdapter from '@sveltejs/adapter-netlify';
import autoAdapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
	// VITE_ADAPTER can come from the environment or a .env file
	const adapter = loadEnv(mode, process.cwd(), '').VITE_ADAPTER;

	return {
		plugins: [
			tailwindcss(),
			sveltekit({
				// See https://kit.svelte.dev/docs/adapters for more information about adapters.
				adapter:
					adapter === 'netlify'
						? netlifyAdapter({
								// if true, will create a Netlify Edge Function rather
								// than using standard Node-based functions
								edge: false,

								// if true, will split your app into multiple functions
								// instead of creating a single one for the entire app.
								// if `edge` is true, this option cannot be used
								split: false
							})
						: adapter === 'node'
							? nodeAdapter({ out: 'build' })
							: autoAdapter()
			})
		],
		test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
	};
});
