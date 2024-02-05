import { writable } from 'svelte/store';

/**
 * @type {import('svelte/store').Writable<import('$lib/DuckDB').DuckDB|undefined>}
 */
export const database = writable(undefined);
