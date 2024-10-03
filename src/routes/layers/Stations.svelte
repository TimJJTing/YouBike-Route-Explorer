<script>
	import { onMount } from 'svelte';
	import { ScatterplotLayer } from '@deck.gl/layers';
	import { map, focusId, hoverId, layers, deckOverlay } from '../store';
	/**
	 * @type {[]|undefined} data
	 */
	export let data = undefined;

	/**
	 * @type {string} layer ID
	 */
	export let layerId = 'stations';

	/**
	 * @type {ScatterplotLayer|undefined} data
	 */
	let layer = undefined;

	/**
	 * @param {string | undefined} hId
	 */
	function render(hId) {
		if (data && $map && $layers && $deckOverlay) {
			// @ts-ignore
			const firstLabelLayerId = $map.getStyle().layers.find((layer) => layer.type === 'symbol').id;
			layer = new ScatterplotLayer({
				id: layerId,
				data,
				pickable: true,
				radiusUnits: 'pixels',
				opacity: 1,
				getPosition: (d) => [d.longitude, d.latitude],
				getRadius: (d) => Math.max(d.capacity / 8, hId === d.stop_id ? 8 : 4),
				getFillColor: (d) => (hId === d.stop_id ? [93, 211, 0, 255] : [93, 211, 0, 80]),
				onClick: (info, event) => focusId.set(info.object.stop_id),
				onHover: (info, event) => hoverId.set(info?.object?.stop_id),
				updateTriggers: {
					getFillColor: hId,
					getRadius: hId
				}
			});
			let layerIdx = $layers.findIndex((l) => l.id === layerId);
			// update layers
			if (layerIdx > -1) {
				$layers = [...$layers];
				$layers[layerIdx] = layer;
				$deckOverlay.setProps({ layers: $layers });
			} else {
				$layers = [...$layers, layer];
			}
		}
	}

	onMount(() => {
		return () => {
			$layers = $layers?.filter((l) => l.id !== layerId);
		};
	});
	$: render($hoverId);
</script>
