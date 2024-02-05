<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { DuckDB } from '$lib/DuckDB';
	import { database } from './store';
	import Map from './Map.svelte';

	/**
	 * @type {Promise<import('@duckdb/duckdb-wasm').AsyncDuckDBConnection> | undefined}
	 */
	// let connection;

	/**
	 * @type {Promise<any> | null | undefined}
	 */
	// let result;

	// const INITIAL_QUERY = `SELECT COUNT(*) FROM parquet_scan('yb_route_weekday_tpc.parquet')`;

	onMount(() => {
		database.update(
			() => new DuckDB('yb_route_weekday_tpc.parquet', `${base}/yb_route_weekday_tpc.parquet`)
		);
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
			<Map/>
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
