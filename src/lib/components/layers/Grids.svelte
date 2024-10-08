<script>
	import { onMount } from 'svelte';
	import { H3HexagonLayer } from '@deck.gl/geo-layers';
	import { cellToLatLng } from 'h3-js';
	import { map, focusId, hoverId, layers, deckOverlay, layerOption } from '$lib/store';
	/**
	 * @type {[]|undefined} data
	 */
	export let data = undefined;

	/**
	 * @type {string} layer ID
	 */
	export let layerId = 'h3';

	/**
	 * @type {H3HexagonLayer|undefined} data
	 */
	let layer = undefined;

	/**
	 * @param {boolean} visible
	 * @param {string | undefined} hId
	 */
	function render(visible, hId) {
		if (data && $map && $layers && $deckOverlay) {
			// @ts-ignore
			const firstLabelLayerId = $map.getStyle().layers.find((layer) => layer.type === 'symbol').id;
			layer = new H3HexagonLayer({
				id: layerId,
				data,
				extruded: false,
				pickable: true,
				opacity: 0.8,
				visible,
				getHexagon: (d) => d.name,
				getFillColor: (d) => [57, 133, 107, (d.capacity * 255) / 200],
				getLineColor: (d) => (hId === d.name ? [255, 255, 255, 185] : [255, 255, 255, 0]),
				getLineWidth: (d) => (hId === d.name ? 5 : 2),
				onClick: (info, event) => {
					try {
						// @ts-ignore return value must be LatLng, we just need to reverse it
						$map.panTo(cellToLatLng(info.object.name).reverse());
					} catch {}
					focusId.set(info.object.name);
				},
				onHover: (info, event) => hoverId.set(info?.object?.name),
				updateTriggers: {
					getLineWidth: hId,
					getLineColor: hId,
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
	$: render($layerOption.grids.visible, $hoverId);
</script>
