<script>
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { layerOption } from '$lib/store';
</script>

<Card.Root class="absolute top-0 right-0 m-8 bg-zinc-900">
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
		<div class="mt-2 flex items-center space-x-2">
			<RadioGroup.Root bind:value={$layerOption.routes.routeType}>
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="all" id="option-all" />
					<Label for="option-all">All</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="inbound" id="option-inbound" />
					<Label for="option-inbound">Inbound</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="outbound" id="option-outbound" />
					<Label for="option-outbound">Outbound</Label>
				</div>
			</RadioGroup.Root>
		</div>
	</Card.Content>
</Card.Root>
