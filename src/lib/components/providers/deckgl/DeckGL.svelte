<script>
	import { onMount } from 'svelte';
	import { getMap } from '$lib/components/providers/map';
	import { setDeckGL, setLayers } from './context';

	/** @type {import('@deck.gl/mapbox').MapboxOverlayProps | undefined} */
	export let overlayProps = undefined;

	let map = getMap();
	let deckgl = setDeckGL(overlayProps);
	let layers = setLayers();

	// update layers
	$: if ($layers && $deckgl) {
		$deckgl.setProps({
			layers: $layers,
			getTooltip: ({ object }) =>
				object && `${object.name}: ${object.sum_of_txn_times ?? object.capacity}`
		});
	}

	onMount(() => {
		if ($map) {
			$map.addControl($deckgl);
		}
		return () => {
			if ($deckgl) {
				$deckgl.finalize();
				$map?.removeControl($deckgl);
			}
		};
	});
</script>


<slot />
