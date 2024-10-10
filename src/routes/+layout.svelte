<script>
	import '../app.css';
	import { base } from '$app/paths';
	import { DuckDBProvider } from '$lib/components/providers/duckdb';
	/** @type {{name: string, url: string}[]} */
	let connections = [
		{ name: 'yb_route_weekday_tpc.parquet', url: `${base}/yb_route_weekday_tpc.parquet` },
		{ name: 'yb_stations_tpc.parquet', url: `${base}/yb_stations_tpc.parquet` },
		{ name: 'yb_grids_tpc.parquet', url: `${base}/yb_grids_tpc.parquet` }
	];
</script>

<div class="app">
	<main>
		<DuckDBProvider {connections}>
			<slot></slot>
		</DuckDBProvider>
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
	}

	main {
		width: 100vw;
		height: 100vh;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
