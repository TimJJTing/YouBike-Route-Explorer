<script>
	import { onMount } from 'svelte';
	import { PathLayer } from '@deck.gl/layers';
	import { map } from '../store';
	import { MapboxLayer } from '@deck.gl/mapbox';
	import { pathProcessor } from '$lib/pathProcessor';

	/**
	 * @type {[]|undefined} data
	 */
	export let data = undefined;

	/**
	 * @type {MapboxLayer} data
	 */
	let layer = undefined;

	function getLayerData(newData) {
        if (newData) {
			return pathProcessor(newData, true, 0.9, 200, false, 600, 50);
		}
		return [];
	}
	$: pathFlow = getLayerData(data);

	onMount(() => {
		if (data && $map) {
			// @ts-ignore
			const firstLabelLayerId = $map.getStyle().layers.find((layer) => layer.type === 'symbol').id;
			const layerId = 'path';

			layer = new MapboxLayer({
				id: layerId,
				type: PathLayer,
				data: pathFlow,
				pickable: true,
				widthUnits: 'pixels',
				capRounded: true,
				getWidth: (d) => d.width,
				getPath: (d) => d.path,
				getColor: (d) => [0, 255, 0]
			});
			$map.addLayer(layer, firstLabelLayerId);

			return () => {
				$map?.removeLayer(layerId);
			};
		}
	});
</script>
