<script>
	import { onMount } from 'svelte';
	import { MapboxOverlay } from '@deck.gl/mapbox';
	import { getMap } from '$lib/components/providers/map';
	import { deckOverlay, layers } from '$lib/store';

	let map = getMap();
	// update layers
	$: if ($layers && $deckOverlay) {
		$deckOverlay.setProps({
			layers: $layers,
			getTooltip: ({ object }) =>
				object && `${object.name}: ${object.sum_of_txn_times ?? object.capacity}`
		});
	}

	onMount(() => {
		if ($map) {
			deckOverlay.set(
				new MapboxOverlay({
					interleaved: true,
					layers: []
				})
			);
			$map.addControl($deckOverlay);
		}
		return () => {
			if ($deckOverlay) {
				$deckOverlay.finalize();
				$map?.removeControl($deckOverlay);
			}
		};
	});
</script>
