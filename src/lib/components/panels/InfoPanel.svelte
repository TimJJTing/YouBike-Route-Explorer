<script>
	import * as Info from '$lib/components/ui/info';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { getRouteInsightQueryString, getData } from '$lib/query';
	import { focus, layerOption } from '$lib/store';
	import { getDuckDB } from '$lib/components/providers/duckdb';
	let duckdb = getDuckDB();
	$: routesQueryString = getRouteInsightQueryString($focus.id, $layerOption.routes.routeType);
	$: routesPromise = getData($duckdb, routesQueryString);
</script>

{#if $focus.id}
	<Info.Root class="absolute left-0 top-0 m-8">
		<Info.Close on:click={() => focus.set({ id: null, name: null, type: null })} />
		<Info.Header>
			<Info.Title>{$focus.name}</Info.Title>
		</Info.Header>
		<Info.Content>
			<div class="flex justify-between">
				<div class="flex-1 text-center">
					<div class="text-5xl font-bold tracking-tighter">
						{$focus.capacity}
					</div>
					<div class="text-[0.70rem] text-muted-foreground">Bike Slots</div>
				</div>
				<div class="flex-1 text-center">
					<div class="text-5xl font-bold tracking-tighter">
						{#await routesPromise}
							<span>...</span>
						{:then routes}
							{@const number = routes?.[0]?.routes ?? undefined}
							{#if number === undefined}
								<span>--</span>
							{:else}
								<span title={number?.toLocaleString('en-US')}>
									{number?.toLocaleString('en-US', { notation: 'compact' })}
								</span>
							{/if}
						{/await}
					</div>
					<div class="text-[0.70rem] text-muted-foreground">Active Routes</div>
				</div>
				<div class="flex-1 text-center">
					<div class="text-5xl font-bold tracking-tighter">
						{#await routesPromise}
							<span>...</span>
						{:then routes}
							{@const number = routes?.[0]?.sum_of_txn_times ?? undefined}
							{#if number === undefined}
								<span>--</span>
							{:else}
								<span title={number?.toLocaleString('en-US')}>
									{number?.toLocaleString('en-US', { notation: 'compact' })}
								</span>
							{/if}
						{/await}
					</div>
					<div class="text-[0.70rem] text-muted-foreground">Ticketed Rides</div>
				</div>
			</div>
			<div class="mt-4 flex items-center space-x-2">
				<Tabs.Root bind:value={$layerOption.routes.routeType} class="w-full">
					<Tabs.List class="grid w-full grid-cols-3">
						<Tabs.Trigger value="all">All</Tabs.Trigger>
						<Tabs.Trigger value="inbound">Inbound</Tabs.Trigger>
						<Tabs.Trigger value="outbound">Outbound</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="all">all</Tabs.Content>
					<Tabs.Content value="inbound">inbound</Tabs.Content>
					<Tabs.Content value="outbound">outbound</Tabs.Content>
				</Tabs.Root>
			</div>
		</Info.Content>
	</Info.Root>
{/if}
