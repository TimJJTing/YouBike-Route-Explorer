import { writable } from 'svelte/store';

/** @type {import('svelte/store').Writable<{id: string|null, name: string|null, type: 'grid'|'station'|null, [key: string]: any}>}}*/
export const focus = writable({ id: null, name: null, type: null });

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

/**
 * @type {import('svelte/store').Writable<Promise<any[] | undefined>>}
 */
export const gridsQuery = writable();
/**
 * @type {import('svelte/store').Writable<Promise<any[] | undefined>>}
 */
export const stationsQuery = writable();
/**
 * @type {import('svelte/store').Writable<Promise<any[] | undefined>>}
 */
export const routesQuery = writable();
/**
 * @type {import('svelte/store').Writable<Promise<any[] | undefined>>}
 */
export const routesInsightQuery = writable();
