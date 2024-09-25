<script>
	import { onMount } from 'svelte';
	import { H3HexagonLayer } from '@deck.gl/geo-layers';
	import { map, focusId, layers } from '../store';
	/**
	 * @type {[]|undefined} data
	 */
	export let data = undefined;

	/**
	 * @type {H3HexagonLayer|undefined} data
	 */
	let layer = undefined;

	onMount(() => {
		if (data && $map && $layers) {
			// @ts-ignore
			const firstLabelLayerId = $map.getStyle().layers.find((layer) => layer.type === 'symbol').id;
			const layerId = 'h3';
			layer = new H3HexagonLayer({
				id: layerId,
				data,
                extruded: false,
				pickable: true,
				opacity: 0.2,
				getHexagon: d => d.name,
				getFillColor: (d) => [93, 211, 0, d.capacity * 255 / 150],
				// onClick: (info, event) => focusId.set(info.capacity)
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
