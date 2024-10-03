<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { DuckDB } from '$lib/DuckDB';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { database, layerVisibility } from './store';
	import Map from './Map.svelte';

	/** @type {{name: string, url: string}[]} */
	let connections = [
		{ name: 'yb_route_weekday_tpc.parquet', url: `${base}/yb_route_weekday_tpc.parquet` },
		{ name: 'yb_stations_tpc.parquet', url: `${base}/yb_stations_tpc.parquet` },
		{ name: 'yb_grids_tpc.parquet', url: `${base}/yb_grids_tpc.parquet` }
	];

	onMount(() => {
		database.update(() => new DuckDB(connections));
		return () => {
			if ($database) {
				$database.disconnect();
			}
		};
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<!-- <section> -->
{#if $database}
	{#await $database.connect()}
		Loading
	{:then conn}
		<Map />
		<Card.Root class="absolute bottom-0 right-0 m-8">
			<Card.Header>
				<Card.Title>Layers</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="flex items-center space-x-2 mb-2">
					<Switch id="grids-layer" bind:checked={$layerVisibility.grids} />
					<Label for="grids-layer">Grids</Label>
				</div>
				<div class="flex items-center space-x-2 my-2">
					<Switch id="stations-layer" bind:checked={$layerVisibility.stations} />
					<Label for="stations-layer">Stations</Label>
				</div>
				<div class="flex items-center space-x-2 mt-2">
					<Switch id="routes-layer" bind:checked={$layerVisibility.routes} />
					<Label for="routes-layer">Routes</Label>
				</div>
			</Card.Content>
		</Card.Root>
	{/await}
{/if}

<!-- </section> -->

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
