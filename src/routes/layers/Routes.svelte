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
	 * @type {[number, number, number][]}
	 */
	const routeColors = [
		[1, 199, 239],
		[1, 151, 239],
		[1, 108, 239],
		[1, 36, 239],
		[1, 32, 239]
	];

	// return route level [0,...,4]
	const getRouteLevel = (d) =>
		Math.min(4, Math.max(0, Math.floor(Math.log2(d.sum_of_txn_times)) - 3));

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
				getPath: (d) => d.path,
				getWidth: (d) => (getRouteLevel(d) + 1) * 1.5 + (d.name === hId ? 1 : 0),
				getColor: (d) => [
					...routeColors[getRouteLevel(d)],
					d.name === hId ? 255 : (getRouteLevel(d) + 1) * 30
				],
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
