<script>
	import { onMount } from 'svelte';
	import { ScatterplotLayer } from '@deck.gl/layers';
	import { map, focusId } from '../store';
	import { MapboxLayer } from '@deck.gl/mapbox';

	/**
	 * @type {[]|undefined} data
	 */
	export let data = undefined;

	/**
	 * @type {MapboxLayer} data
	 */
	let layer = undefined;

	onMount(() => {
		if (data && $map) {
			// @ts-ignore
			const firstLabelLayerId = $map.getStyle().layers.find((layer) => layer.type === 'symbol').id;
			const layerId = 'stations';
			layer = new MapboxLayer({
				id: layerId,
				type: ScatterplotLayer,
				data,
				pickable: true,
				radiusUnits: 'pixels',
				getPosition: (d) => [d.on_stop_lon, d.on_stop_lat],
				getRadius: (d) => 4,
				getFillColor: (d) => [255, 0, 0],
				onClick: (e) => focusId.set(e.object.on_stop_id)
			});
			$map.addLayer(layer, firstLabelLayerId);

			return () => {
				$map?.removeLayer(layerId);
			};
		}
	});
</script>
