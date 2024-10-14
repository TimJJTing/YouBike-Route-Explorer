<script>
	import {
		focus,
		layerOption,
		gridsQuery,
		stationsQuery,
		routesQuery,
		routesInsightQuery
	} from '$lib/store';
	import {
		getGridsQueryString,
		getStationsQueryString,
		getRoutesQueryString,
		getRoutesInsightQueryString,
		getData
	} from '$lib/query';
	import { Routes, Stations, Grids } from '$lib/components/layers';
	import { Mapbox } from '$lib/components/providers/mapbox';
	import { DeckGL } from '$lib/components/providers/deckgl';
	import { LayerControl, InfoPanel } from '$lib/components/panels';
	import { getDuckDB } from '$lib/components/providers/duckdb';

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
