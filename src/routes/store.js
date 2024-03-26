import { writable } from 'svelte/store';

/**
 * @type {import('svelte/store').Writable<import('$lib/DuckDB').DuckDB|undefined>}
 */
export const database = writable(undefined);

/** @type {import('svelte/store').Writable<import('mapbox-gl').Map|undefined>}}*/
export const map = writable(undefined);

/** @type {import('svelte/store').Writable<string|undefined>}}*/
export const focusId = writable('U101001');
