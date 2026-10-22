<script>
	import {
		focus,
		layerOption,
		gridsQuery,
		stationsQuery,
		routesQuery,
		routesInsightQuery
	} from '#lib/store.js';
	import {
		getGridsQueryString,
		getStationsQueryString,
		getRoutesQueryString,
		getRoutesInsightQueryString,
		getData
	} from '#lib/query.js';
	import { Routes, Stations, Grids } from '#lib/components/layers/index.js';
	import { Mapbox } from '#lib/components/providers/mapbox/index.js';
	import { DeckGL } from '#lib/components/providers/deckgl/index.js';
	import { LayerControl, InfoPanel } from '#lib/components/panels/index.js';
	import { getDuckDB } from '#lib/components/providers/duckdb/index.js';

	let duckdb = getDuckDB();

	$: gridsQueryString = getGridsQueryString();
	$: $gridsQuery = getData($duckdb, gridsQueryString);
	$: stationsQueryString = getStationsQueryString();
	$: $stationsQuery = getData($duckdb, stationsQueryString);
	$: routesQueryString = getRoutesQueryString($focus.id, $layerOption.routes.routeType);
	$: $routesQuery = getData($duckdb, routesQueryString);
	$: routesInsightQueryString = getRoutesInsightQueryString(
		$focus.id,
		$layerOption.routes.routeType
	);
	$: $routesInsightQuery = getData($duckdb, routesInsightQueryString);
</script>

<svelte:head>
	<title>YouBike Route Explorer</title>
	<meta name="description" content="An exploratory data visualization tool for YouBike" />
</svelte:head>

<Mapbox>
	<DeckGL>
		{#await $gridsQuery}
			<h1>Loading grids...</h1>
		{:then grids}
			<Grids data={grids} layerId="h3" />
		{/await}

		{#await $stationsQuery}
			<h1>Loading stations...</h1>
		{:then stations}
			<Stations data={stations} layerId="stations" />
		{/await}

		{#await $routesQuery}
			<h1>Loading routes...</h1>
		{:then routes}
			<Routes data={routes} layerId="routes" />
		{/await}
	</DeckGL>
</Mapbox>
<LayerControl />
<InfoPanel />
