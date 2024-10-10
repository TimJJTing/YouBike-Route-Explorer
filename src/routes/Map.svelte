<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { database, map, focusId, deckOverlay, layerOption } from './store';
	import {
		getGridsQueryString,
		getStationsQueryString,
		getRouteQueryString,
		getData
	} from './query';
	import Routes from './layers/Routes.svelte';
	import Stations from './layers/Stations.svelte';
	import DeckOverlay from './layers/DeckOverlay.svelte';
	import Grids from './layers/Grids.svelte';
	mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
	const mapStyle = import.meta.env.VITE_MAPBOX_MAPSTYLE || 'mapbox://styles/mapbox/dark-v9';

	/** @type {import('mapbox-gl').LngLatLike}}*/
	const center = [121.53, 25.045];

	let container;

	/** @type {boolean} */
	let mapReady = false;

	$: gridsQueryString = getGridsQueryString();
	$: gridsPromise = getData($database, gridsQueryString);
	$: stationsQueryString = getStationsQueryString();
	$: stationsPromise = getData($database, stationsQueryString);
	$: routesQueryString = getRouteQueryString($focusId, $layerOption.routes.routeType);
	$: routesPromise = getData($database, routesQueryString);

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
			{#await gridsPromise}
				<h1>Loading grids...</h1>
			{:then grids}
				<Grids data={grids} layerId="h3" />
			{/await}

			{#await stationsPromise}
				<h1>Loading stations...</h1>
			{:then stations}
				<Stations data={stations} layerId="stations" />
			{/await}

			{#await routesPromise}
				<h1>Loading routes...</h1>
			{:then routes}
				<Routes data={routes} layerId="routes" />
			{/await}
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
