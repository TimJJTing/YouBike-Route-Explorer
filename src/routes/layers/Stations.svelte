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
				opacity: 0.5,
				getPosition: (d) => [d.longitude, d.latitude],
				getRadius: (d) => Math.max( d.capacity / 8, 4),
				getFillColor: (d) => [1, 165, 239],
				onClick: (info, event) => focusId.set(info.object.stop_id)
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
