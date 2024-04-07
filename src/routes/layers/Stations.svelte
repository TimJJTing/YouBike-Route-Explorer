<script>
	import { onMount } from 'svelte';
	import { ScatterplotLayer } from '@deck.gl/layers';
	import { map, focusId, layers } from '../store';
	/**
	 * @type {[]|undefined} data
	 */
	export let data = undefined;

	/**
	 * @type {ScatterplotLayer|undefined} data
	 */
	let layer = undefined;

	onMount(() => {
		if (data && $map && $layers) {
			// @ts-ignore
			const firstLabelLayerId = $map.getStyle().layers.find((layer) => layer.type === 'symbol').id;
			const layerId = 'stations';
			layer = new ScatterplotLayer({
				id: layerId,
				data,
				pickable: true,
				radiusUnits: 'pixels',
				getPosition: (d) => [d.on_stop_lon, d.on_stop_lat],
				getRadius: (d) => 4,
				getFillColor: (d) => [255, 0, 0],
				onClick: (info, event) => focusId.set(info.object.on_stop_id)
			});
			
			// add layer
			$layers = [...$layers, layer];

			// remove layer on unmount
			return () => {
				$layers = $layers?.filter((l) => l.id !== layerId);
			};
		}
	});
</script>
