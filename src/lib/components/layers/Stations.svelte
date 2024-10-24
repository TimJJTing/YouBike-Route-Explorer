<script>
	import { onMount } from 'svelte';
	import { ScatterplotLayer } from '@deck.gl/layers';
	import { focus, hoverId, layerOption } from '$lib/store';
	import { getMap, getDimensions } from '$lib/components/providers/mapbox';
	import { getDeckGL, getLayers } from '$lib/components/providers/deckgl';
	/**
	 * @type {any[]|undefined} data
	 */
	export let data = undefined;

	/**
	 * @type {string} layer ID
	 */
	export let layerId = 'stations';

	let map = getMap();
	let dimensions = getDimensions();
	let deckgl = getDeckGL();
	let layers = getLayers();

	/**
	 * @type {ScatterplotLayer|undefined} data
	 */
	let layer = undefined;

	/**
	 * @param {boolean} visible
	 * @param {string | undefined} hId
	 */
	function render(visible, hId) {
		if (data && $map && $layers && $deckgl) {
			// @ts-ignore
			const firstLabelLayerId = $map.getStyle().layers.find((layer) => layer.type === 'symbol').id;
			layer = new ScatterplotLayer({
				id: layerId,
				data,
				pickable: true,
				radiusUnits: 'pixels',
				opacity: 1,
				visible,
				getPosition: (d) => [d.longitude, d.latitude],
				getRadius: (d) => Math.max(d.capacity / 8, hId === d.id ? 8 : 4),
				getFillColor: (d) => (hId === d.id ? [93, 211, 0, 255] : [93, 211, 0, 80]),
				onClick: (info, event) => {
					// TODO: zoom and padding according to screen size
					$map.flyTo({
						center: [info.object.longitude, info.object.latitude],
						zoom: 12,
						padding: { left: 400 }
					});
					focus.set({
						type: 'station',
						...info.object
					});
				},
				onHover: (info, event) => hoverId.set(info?.object?.id),
				updateTriggers: {
					getFillColor: hId,
					getRadius: hId,
					visible: visible
				}
			});
			let layerIdx = $layers.findIndex((l) => l.id === layerId);
			// update layers
			if (layerIdx > -1) {
				$layers = [...$layers];
				$layers[layerIdx] = layer;
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
	$: render($layerOption.stations.visible, $hoverId);
</script>
