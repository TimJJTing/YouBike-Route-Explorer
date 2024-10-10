<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { map, deckOverlay } from '$lib/store';
	import { DeckOverlay } from '$lib/components/layers';
	
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

	let container;

	/** @type {boolean} */
	let mapReady = false;

	onMount(async () => {
		map.set(
			new mapboxgl.Map({
				accessToken,
				container: 'container',
				style: mapStyle,
				center,
				zoom,
				pitch
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
			<slot />
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
