<script>
	import { database, focusId, layerOption } from '$lib/store';
	import {
		getGridsQueryString,
		getStationsQueryString,
		getRouteQueryString,
		getData
	} from '$lib/query';
	import { Routes, Stations, Grids } from '$lib/components/layers';
	import { MapProvider } from '$lib/components/providers/map';
	import { LayerControl } from '$lib/components/panels';

	$: gridsQueryString = getGridsQueryString();
	$: gridsPromise = getData($database, gridsQueryString);
	$: stationsQueryString = getStationsQueryString();
	$: stationsPromise = getData($database, stationsQueryString);
	$: routesQueryString = getRouteQueryString($focusId, $layerOption.routes.routeType);
	$: routesPromise = getData($database, routesQueryString);
</script>

<svelte:head>
	<title>YouBike Route Explorer</title>
	<meta name="description" content="An exploratory data visualization tool for YouBike" />
</svelte:head>

<MapProvider>
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
</MapProvider>
<LayerControl />
