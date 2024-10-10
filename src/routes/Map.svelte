<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { map, deckOverlay } from './store';
	import DeckOverlay from './layers/DeckOverlay.svelte';
	mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
	const mapStyle = import.meta.env.VITE_MAPBOX_MAPSTYLE || 'mapbox://styles/mapbox/dark-v9';

	/** @type {import('mapbox-gl').LngLatLike}}*/
	const center = [121.53, 25.045];

	let container;

	/** @type {boolean} */
	let mapReady = false;

	onMount(async () => {
		map.set(
			new mapboxgl.Map({
				container: 'container',
				style: mapStyle,
				center: center,
				zoom: 11.5,
				pitch: 0
			})
		);

		$map?.on('load', () => {
			mapReady = true;
		});
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css" rel="stylesheet" />
</svelte:head>
<div id="container" bind:this={container}>
	{#if mapReady}
		<DeckOverlay />
		{#if $deckOverlay}
			<slot/>
		{/if}
	{/if}
</div>

<style lang="scss">
	div#container {
		margin: 0;
		width: 100vw;
		height: 100vh;
	}
</style>
