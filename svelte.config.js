import { config as envConfig } from 'dotenv';
import nodeAdapter from '@sveltejs/adapter-node';
import netlifyAdapter from '@sveltejs/adapter-netlify';
import autoAdapter from '@sveltejs/adapter-auto';

// Load environment variables
envConfig();
const adapter = process.env?.VITE_ADAPTER;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
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
					? nodeAdapter({
							out: 'build',
							env: {
								host: 'HOST',
								port: 3000
							}
						})
					: autoAdapter()
	}
};

export default config;
