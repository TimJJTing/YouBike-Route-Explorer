<script>
	import * as Info from '$lib/components/ui/info';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { focus, layerOption, routesInsightQuery } from '$lib/store';
	import RoutesTable from './RoutesTable.svelte';
	const tabs = ['all', 'inbound', 'outbound'];
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
						{#await $routesInsightQuery}
							<span>...</span>
						{:then insight}
							{@const number = insight?.[0]?.routes ?? undefined}
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
						{#await $routesInsightQuery}
							<span>...</span>
						{:then insight}
							{@const number = insight?.[0]?.sum_of_txn_times ?? undefined}
							{#if number === undefined}
								<span>--</span>
							{:else}
								<span title={number?.toLocaleString('en-US')}>
									{number?.toLocaleString('en-US', { notation: 'compact' })}
								</span>
							{/if}
						{/await}
					</div>
					<div class="text-[0.70rem] text-muted-foreground">Ticketed Trips</div>
				</div>
			</div>
			<div class="mt-4 flex items-center space-x-2">
				<Tabs.Root bind:value={$layerOption.routes.routeType} class="w-full">
					<Tabs.List class="grid w-full grid-cols-3">
						{#each tabs as tab (`${tab}-list`)}
							<Tabs.Trigger value={tab}>{tab[0].toUpperCase() + tab.slice(1)}</Tabs.Trigger>
						{/each}
					</Tabs.List>
					{#each tabs as tab (tab)}
						<Tabs.Content value={tab}>
							<RoutesTable />
						</Tabs.Content>
					{/each}
				</Tabs.Root>
			</div>
		</Info.Content>
	</Info.Root>
{/if}
