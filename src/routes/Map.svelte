<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { database, map, focusId } from './store';
	import Routes from './layers/Routes.svelte';
	import Stations from './layers/Stations.svelte';
	import DeckOverlay from './layers/DeckOverlay.svelte';
	import Grids from './layers/Grids.svelte';
	mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

	/** @type {import('mapbox-gl').LngLatLike}}*/
	const center = [121.53, 25.045];

	let container;

	/** @type {boolean} */
	let mapReady = false;

	/**
	 * @param {string} queryString
	 */
	async function getData(queryString) {
		const results = await $database?.query(queryString);
		return results;
	}
	$: gridsQueryString = `SELECT h3_cell_lv9 as name, capacity FROM parquet_scan('yb_grids_tpc.parquet')`;
	$: gridsPromise = getData(gridsQueryString);

	$: stationsQueryString = `SELECT DISTINCT on_stop AS name, on_stop_id, on_stop_lat, on_stop_lon FROM parquet_scan('yb_route_weekday_tpc.parquet')`;
	$: stationsPromise = getData(stationsQueryString);

	/**
	 * @param {string|undefined} focusId
	 */
	function getRouteQueryString(focusId) {
		if (focusId?.startsWith('U'))
			return `SELECT * FROM parquet_scan('yb_route_weekday_tpc.parquet') WHERE off_stop_id != on_stop_id AND on_stop_id='${focusId}'`;
		else
			return `SELECT * FROM parquet_scan('yb_route_weekday_tpc.parquet') WHERE off_stop_id != on_stop_id AND on_stop_h3_cell_lv9='${focusId}'`;
	}
	// TODO: also show routes where off_stop_id=focusId
	$: routesQueryString = getRouteQueryString($focusId);
	$: routesPromise = getData(routesQueryString);

	onMount(async () => {
		map.set(
			new mapboxgl.Map({
				container: 'container',
				style: 'mapbox://styles/mapbox/dark-v9',
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

		{#await gridsPromise}
			<h1>Loading grids...</h1>
		{:then grids}
			<Grids data={grids} />
		{/await}

		{#await stationsPromise}
			<h1>Loading stations...</h1>
		{:then stations}
			<Stations data={stations} />
		{/await}

		{#await routesPromise}
			<h1>Loading routes...</h1>
		{:then routes}
			<Routes data={routes} />
		{/await}
	{/if}
</div>

<style lang="scss">
	div#container {
		margin: 0;
		width: 100vw;
		height: 100vh;
	}
</style>
