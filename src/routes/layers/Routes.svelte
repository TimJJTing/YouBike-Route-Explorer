<script>
	import { onMount } from 'svelte';
	import { PathLayer } from '@deck.gl/layers';
	import { map, layers } from '../store';
	import { pathProcessor } from '$lib/pathProcessor';

	/**
	 * @type {[]|undefined} data
	 */
	export let data = undefined;

	/**
	 * @type {PathLayer|undefined} data
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
		if (data && $map && $layers) {
			// @ts-ignore
			const firstLabelLayerId = $map.getStyle().layers.find((layer) => layer.type === 'symbol').id;
			const layerId = 'path';

			layer = new PathLayer({
				id: layerId,
				data: pathFlow,
				pickable: true,
				widthUnits: 'pixels',
				capRounded: true,
				opacity: 0.5, 
				getWidth: (d) => d.width,
				getPath: (d) => d.path,
				getColor: (d) => [93, 211, 0]
			});

			// add layer
			$layers = [...$layers, layer];

			// remove layer on unmount
			return () => {
				$layers = $layers?.filter(l=>l.id!==layerId);
			};
		}
	});
</script>
