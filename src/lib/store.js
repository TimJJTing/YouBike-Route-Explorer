import { writable } from 'svelte/store';

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
