<script>
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { layerOption } from '$lib/store';
</script>

<Card.Root class="absolute right-0 top-0 m-8 bg-zinc-900">
	<Card.Header>
		<Card.Title>Layers</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="mb-2 flex items-center space-x-2">
			<Switch id="grids-layer" bind:checked={$layerOption.grids.visible} />
			<Label for="grids-layer">Grids</Label>
		</div>
		<div class="my-2 flex items-center space-x-2">
			<Switch id="stations-layer" bind:checked={$layerOption.stations.visible} />
			<Label for="stations-layer">Stations</Label>
		</div>
		<div class="mt-2 flex items-center space-x-2">
			<Switch id="routes-layer" bind:checked={$layerOption.routes.visible} />
			<Label for="routes-layer">Routes</Label>
		</div>
	</Card.Content>
</Card.Root>
