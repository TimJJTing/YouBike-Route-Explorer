<script>
	import * as Info from '$lib/components/ui/info';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { focus, layerOption, routesInsightQuery } from '$lib/store';
	import RoutesTable from './RoutesTable.svelte';
	const tabs = ['all', 'inbound', 'outbound'];
</script>

{#if $focus.id}
	<Info.Root class="absolute left-0 top-0 m-8 flex h-[600px] w-[450px] flex-col">
		<Info.Close on:click={() => focus.set({ id: null, name: null, type: null })} />
		<Info.Header class="shrink-0">
			<Info.Title>{$focus.name}</Info.Title>
		</Info.Header>
		<Info.Content class="flex grow flex-col">
			<div class="flex shrink-0 justify-between">
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
			<Tabs.Root bind:value={$layerOption.routes.routeType} class="mt-4 flex w-full grow flex-col">
				<Tabs.List class="grid w-full shrink-0 grid-cols-3 justify-start">
					{#each tabs as tab (`${tab}-list`)}
						<Tabs.Trigger value={tab}>{tab[0].toUpperCase() + tab.slice(1)}</Tabs.Trigger>
					{/each}
				</Tabs.List>
				{#each tabs as tab (tab)}
					<Tabs.Content value={tab} class="grow flex flex-col">
						{#if tab === $layerOption.routes.routeType}
							<div class="flex flex-col basis-[378px] grow overflow-auto">
								<RoutesTable />
							</div>
						{/if}
					</Tabs.Content>
				{/each}
			</Tabs.Root>
		</Info.Content>
	</Info.Root>
{/if}
