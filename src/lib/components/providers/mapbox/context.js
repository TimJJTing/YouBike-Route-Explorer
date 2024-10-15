import { writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
/**
 * @returns {import('svelte/store').Writable<import('mapbox-gl').Map|undefined>}
 */
export const setMap = () => {
	/**
	 * @type {import('svelte/store').Writable<import('mapbox-gl').Map|undefined>}
	 */
	let map = writable();
	setContext('map', map);
	return map;
};

/**
 * @returns {import('svelte/store').Writable<import('mapbox-gl').Map|undefined>}
 */
export function getMap() {
	return getContext('map');
}

export const setDimensions = () => {
	/**
	 * @type {import('svelte/store').Writable<{width: number, height: number}>}
	 */
	let dimensions = writable({width: 0, height: 0});
	setContext('dimensions', dimensions);
	return dimensions;
};

/**
 * @returns {import('svelte/store').Writable<{width: number, height: number}>}
 */
export const getDimensions = () => {
	return getContext('dimensions');
};
