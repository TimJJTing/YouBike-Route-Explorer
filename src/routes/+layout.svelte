<script>
	import '../app.css';
	import { base } from '$app/paths';
	import { DuckDB } from '$lib/components/providers/duckdb';
	/** @type {{name: string, url: string}[]} */
	let connections = [
		{ name: 'yb_route_weekday_tpc.parquet', url: `${base}/yb_route_weekday_tpc.parquet` },
		{ name: 'yb_stations_tpc.parquet', url: `${base}/yb_stations_tpc.parquet` },
		{ name: 'yb_grids_tpc.parquet', url: `${base}/yb_grids_tpc.parquet` }
	];
</script>

<div class="app">
	<main>
		<DuckDB {connections}>
			<slot></slot>
		</DuckDB>
	</main>
</div>

<style>
	.app {
		max-height: 100vh;
	}

	main {
		width: 100vw;
		height: 100vh;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
