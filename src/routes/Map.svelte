<script>
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { database, map, focusId, deckOverlay, layerOption } from './store';
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

	/**
	 * @param {string} queryString
	 */
	async function getData(queryString) {
		const results = await $database?.query(queryString);
		return results;
	}
	$: gridsQueryString = `SELECT h3_cell_lv9 as name, capacity FROM parquet_scan('yb_grids_tpc.parquet')`;
	$: gridsPromise = getData(gridsQueryString);

	$: stationsQueryString = `SELECT stop_id, stop_name AS name, latitude, longitude, capacity FROM parquet_scan('yb_stations_tpc.parquet')`;
	$: stationsPromise = getData(stationsQueryString);
	/**
	 * @param {string|undefined} focusId
	 * @param {'all'|'inbound'|'outbound'} routeType
	 */
	function getRouteQueryString(focusId, routeType) {
		let routeTypeClause = '';
		if (routeType === 'inbound') routeTypeClause = `AND off_id='${focusId}'`;
		else if (routeType === 'outbound') routeTypeClause = `AND on_id='${focusId}'`;
		else if (routeType === 'all')
			routeTypeClause = `AND ( on_id='${focusId}' OR off_id='${focusId}' )`;
		let queryString = 
		`SELECT * FROM parquet_scan('yb_route_weekday_tpc.parquet') WHERE off_id != on_id ${routeTypeClause};`;
		return queryString;
	}
	// TODO: also show routes where off_id=focusId
	$: routesQueryString = getRouteQueryString($focusId, $layerOption.routes.routeType);
	$: routesPromise = getData(routesQueryString);

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
