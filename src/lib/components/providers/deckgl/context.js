import { writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
import { MapboxOverlay } from '@deck.gl/mapbox';

/**
 * @param {import('@deck.gl/mapbox').MapboxOverlayProps | undefined} overlayProps
 * @returns {import('svelte/store').Writable<import('@deck.gl/mapbox').MapboxOverlay>}
 */
export const setDeckGL = (overlayProps = undefined) => {
	/**
	 * @type {import('svelte/store').Writable<import('@deck.gl/mapbox').MapboxOverlay>}
	 */
	let deck = writable(
		new MapboxOverlay({
			interleaved: true,
			layers: [],
			...(overlayProps || {})
		})
	);
	setContext('deck', deck);
	return deck;
};

/**
 * @returns {import('svelte/store').Writable<import('@deck.gl/mapbox').MapboxOverlay>}
 */
export function getDeckGL() {
	return getContext('deck');
}

/** @returns {import('svelte/store').Writable<import('@deck.gl/core').Layer[]>}*/
export const setLayers = () => {
	/**
	 * @type {import('svelte/store').Writable<import('@deck.gl/core').Layer[]>}
	 */
	let layers = writable([]);
	setContext('layers', layers);
	return layers;
};

/**
 * @returns {import('svelte/store').Writable<import('@deck.gl/core').Layer[]>}
 */
export function getLayers() {
	return getContext('layers');
}
