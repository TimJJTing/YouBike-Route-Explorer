<script>
	import { onMount } from 'svelte';
	import { H3HexagonLayer } from '@deck.gl/geo-layers';
	import { cellToLatLng } from 'h3-js';
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
	export let layerId = 'h3';

	let map = getMap();
	let dimensions = getDimensions();
	let deckgl = getDeckGL();
	let layers = getLayers();

	/**
	 * @type {H3HexagonLayer|undefined} data
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
			layer = new H3HexagonLayer({
				id: layerId,
				data,
				extruded: false,
				pickable: true,
				opacity: 0.8,
				visible,
				getHexagon: (d) => d.id,
				getFillColor: (d) => [57, 133, 107, (d.capacity * 255) / 200],
				getLineColor: (d) => (hId === d.id ? [255, 255, 255, 185] : [255, 255, 255, 0]),
				getLineWidth: (d) => (hId === d.id ? 5 : 2),
				onClick: (info, event) => {
					try {
						// TODO: zoom and padding according to screen size
						$map.flyTo({
							// @ts-ignore return value must be LatLng, we just need to reverse it
							center: cellToLatLng(info.object.id).reverse(),
							zoom: 12,
							padding: { left: 400 }
						});
					} catch {}
					focus.set({
						type: 'grid',
						...info.object
					});
				},
				onHover: (info, event) => hoverId.set(info?.object?.id),
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
				$deckgl.setProps({ layers: $layers });
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
