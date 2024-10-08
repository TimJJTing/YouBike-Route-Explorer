import { writable } from 'svelte/store';

/**
 * @type {import('svelte/store').Writable<import('$lib/components/providers/duckdb/DuckDB').DuckDB|undefined>}
 */
export const database = writable(undefined);

/** @type {import('svelte/store').Writable<import('mapbox-gl').Map|undefined>}}*/
export const map = writable(undefined);

/** @type {import('svelte/store').Writable<import('@deck.gl/mapbox').MapboxOverlay|undefined>}}*/
export const deckOverlay = writable(undefined);

/** @type {import('svelte/store').Writable<import('@deck.gl/core').Layer[]|undefined>}}*/
export const layers = writable([]);

/** @type {import('svelte/store').Writable<string|undefined>}}*/
export const focusId = writable('U101001');

/** @type {import('svelte/store').Writable<string|undefined>}}*/
export const hoverId = writable(undefined);

/**
 * @typedef {{visible: boolean}} GridsOption
 * @typedef {{visible: boolean}} StationsOption
 * @typedef {{visible: boolean, routeType: 'all'|'inbound'|'outbound'}} RoutesOption
 * @type {import('svelte/store').Writable<{grids: GridsOption, stations: StationsOption, routes: RoutesOption}>}
 * */
export const layerOption = writable({
	grids: { visible: true },
	stations: { visible: true },
	routes: { visible: true, routeType: 'all' }
});
