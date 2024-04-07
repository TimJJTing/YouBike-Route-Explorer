<script>
	import { onMount } from 'svelte';
	import { MapboxOverlay } from '@deck.gl/mapbox';
	import { map, deckOverlay, layers } from '../store';

    // update layers
    $: if($layers && $deckOverlay) $deckOverlay.setProps({layers: $layers});

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
			$deckOverlay?.finalize();
            $map?.removeControl($deckOverlay);
		}
	});
</script>