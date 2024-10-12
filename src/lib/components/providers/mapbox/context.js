import { writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
/**
 * @returns {import('svelte/store').Writable<import('mapbox-gl').Map|undefined>}
 */
export const setMapbox = () => {
	/**
	 * @type {import('svelte/store').Writable<import('mapbox-gl').Map|undefined>}
	 */
	let mapbox = writable();
	setContext('mapbox', mapbox);
	return mapbox;
};

/**
 * @returns {import('svelte/store').Writable<import('mapbox-gl').Map|undefined>}
 */
export function getMapbox() {
	return getContext('mapbox');
}
