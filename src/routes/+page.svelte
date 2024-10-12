<script>
	import { focusId, layerOption } from '$lib/store';
	import {
		getGridsQueryString,
		getStationsQueryString,
		getRouteQueryString,
		getData
	} from '$lib/query';
	import { Routes, Stations, Grids } from '$lib/components/layers';
	import { Mapbox } from '$lib/components/providers/mapbox';
	import { DeckGL } from '$lib/components/providers/deckgl';
	import { LayerControl } from '$lib/components/panels';
	import { getDuckDB } from '$lib/components/providers/duckdb';

	let duckdb = getDuckDB();

	$: gridsQueryString = getGridsQueryString();
	$: gridsPromise = getData($duckdb, gridsQueryString);
	$: stationsQueryString = getStationsQueryString();
	$: stationsPromise = getData($duckdb, stationsQueryString);
	$: routesQueryString = getRouteQueryString($focusId, $layerOption.routes.routeType);
	$: routesPromise = getData($duckdb, routesQueryString);
</script>

<svelte:head>
	<title>YouBike Route Explorer</title>
	<meta name="description" content="An exploratory data visualization tool for YouBike" />
</svelte:head>

<Mapbox>
	<DeckGL>
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
	</DeckGL>
</Mapbox>
<LayerControl />
