<script>
	import { database, focusId, layerOption } from './store';
	import {
		getGridsQueryString,
		getStationsQueryString,
		getRouteQueryString,
		getData
	} from './query';
	import Routes from './layers/Routes.svelte';
	import Stations from './layers/Stations.svelte';
	import Grids from './layers/Grids.svelte';
	import Map from './Map.svelte';
	import LayerControl from './LayerControl.svelte';

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

<Map>
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
</Map>
<LayerControl />
