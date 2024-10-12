<script>
	import { onMount } from 'svelte';
	import { getMap } from '$lib/components/providers/mapbox';
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
			getTooltip: ({ object }) => {
				if (object?.sum_of_txn_times !== undefined) {
					return `${object.name}: ${object.sum_of_txn_times} ticketed trips`;
				} else if (object?.capacity !== undefined) {
					return `${object.name}: ${object.capacity} YouBike slots`;
				} else if (object?.name) {
					return object.name;
				}
			}
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
