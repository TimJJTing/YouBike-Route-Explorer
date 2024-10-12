<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { setMapbox } from './context';

	/** @type {string} */
	export let mapStyle = import.meta.env.VITE_MAPBOX_MAPSTYLE || 'mapbox://styles/mapbox/dark-v9';
	/** @type {string} */
	export let accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
	/** @type {import('mapbox-gl').LngLatLike}}*/
	export let center = [121.53, 25.045];
	/** @type {number} */
	export let zoom = 11.5;
	/** @type {number} */
	export let pitch = 0;
	/**
	 * Other Mapbox GL JS's global properties and options that you can access while initializing your map or accessing information about its status.
	 * @type {import('mapbox-gl').MapOptions|undefined}
	 */
	export let mapOptions = undefined;

	let container;
	/** @type {boolean} */
	let mapReady = false;

	// mapboxgl requires a container mounted in the dom already before initialization, so we cannot new a Map in the setMapbox context
	let map = setMapbox();

	onMount(() => {
		$map = new mapboxgl.Map({
			accessToken,
			container: 'container',
			style: mapStyle,
			center,
			zoom,
			pitch,
			...(mapOptions || {})
		});

		$map?.on('load', () => {
			mapReady = true;
		});

		return () => {
			// remove map instance to release resources
			$map?.remove();
		};
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css" rel="stylesheet" />
</svelte:head>
<div id="container" bind:this={container}>
	{#if mapReady}
		<slot />
	{/if}
</div>

<style lang="scss">
	div#container {
		margin: 0;
		width: 100vw;
		height: 100vh;
	}
</style>
