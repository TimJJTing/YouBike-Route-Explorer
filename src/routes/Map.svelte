<script>
	import { onMount } from 'svelte';
	// @ts-ignore
	import { MapboxLayer } from '@deck.gl/mapbox';
	// @ts-ignore
	import { ScatterplotLayer, LineLayer } from '@deck.gl/layers';
	import mapboxgl from 'mapbox-gl';
	import { database } from './store';
	const INITIAL_QUERY = `SELECT * FROM parquet_scan('yb_route_weekday_tpc.parquet') WHERE off_stop_id != on_stop_id LIMIT 50`;
	mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

	/** @type {import('mapbox-gl').LngLatLike}}*/
	const center = [121.53, 25.045];

	let container;
	/**
	 * @type {any}
	 */
	let results;

	onMount(async () => {
		results = await $database?.query(INITIAL_QUERY);

		const map = new mapboxgl.Map({
			container: 'container',
			style: 'mapbox://styles/mapbox/light-v9',
			center: center,
			zoom: 11.5,
			pitch: 0
		});
		map.on('load', () => {
			// @ts-ignore
			const firstLabelLayerId = map.getStyle().layers.find((layer) => layer.type === 'symbol').id;

			if (results) {
				map.addLayer(
					new MapboxLayer({
						id: 'deckgl-line',
						type: LineLayer,
						data: results,
						pickable: true,
						getWidth: (d) => d.width,
						getSourcePosition: (d) => [d.on_stop_lon, d.on_stop_lat],
						getTargetPosition: (d) => [d.off_stop_lon, d.off_stop_lat],
						getColor: (d) => [0, 255, 0]
					}),
					firstLabelLayerId
				);
			}
		});
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />
</svelte:head>
<div id="container" bind:this={container}>
	<!-- {results} -->
</div>

<style lang="scss">
	div#container {
		margin: 0;
		width: 100vw;
		height: 100vh;
	}
</style>
