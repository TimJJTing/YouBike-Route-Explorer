<script>
	import { onMount } from 'svelte';
	import { PathLayer } from '@deck.gl/layers';
	import { map, layers, hoverId, deckOverlay, layerVisibility } from '../store';
	import { pathProcessor } from '$lib/pathProcessor';

	/**
	 * @type {[]|undefined} data
	 */
	export let data = undefined;

	/**
	 * @type {string} layer ID
	 */
	export let layerId = 'routes';

	/**
	 * @type {PathLayer|undefined} data
	 */
	let layer = undefined;

	/**
	 * @param {Object[] | undefined} newData
	 */
	function getLayerData(newData) {
		if (newData) {
			return pathProcessor(newData, true, 0.9, 200, false, 600, 50);
		}
		return [];
	}
	$: pathFlow = getLayerData(data);

	/**
	 * @param {boolean} visible
	 * @param {string | undefined} hId
	 * @param {Object[] | undefined} pathFlow
	 */
	function render(visible, hId, pathFlow) {
		if (data && $map && $layers && $deckOverlay) {
			// @ts-ignore
			const firstLabelLayerId = $map.getStyle().layers.find((layer) => layer.type === 'symbol').id;

			layer = new PathLayer({
				id: layerId,
				data: pathFlow,
				pickable: true,
				widthUnits: 'pixels',
				capRounded: true,
				opacity: 1,
				visible,
				getWidth: (d) => Math.max(d.width, d.name === hId ? 3 : 1.5),
				getPath: (d) => d.path,
				getColor: (d) => (d.name === hId ? [1, 165, 239, 255] : [1, 165, 239, 60]),
				onHover: (info, event) => hoverId.set(info?.object?.name),
				updateTriggers: {
					getColor: hId,
					getWidth: hId,
					visible: visible
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
	$: render($layerVisibility.routes, $hoverId, pathFlow);
</script>
