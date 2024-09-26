<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { DuckDB } from '$lib/DuckDB';
	import { database } from './store';
	import Map from './Map.svelte';

	/** @type {{name: string, url: string}[]} */
	let connections = [
		{ name: 'yb_route_weekday_tpc.parquet', url: `${base}/yb_route_weekday_tpc.parquet` },
		{ name: 'yb_grids_tpc.parquet', url: `${base}/yb_grids_tpc.parquet` },
		// { name: 'yb_route_weekday_tpc_h3.parquet', url: `${base}/yb_route_weekday_tpc_h3.parquet` },
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
