<script>
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Table from '$lib/components/ui/table/index.js';
	import { hoverId, routesQuery } from '$lib/store';
	let page = 1;
	const perPage = 5;
</script>

{#await $routesQuery then routes}
	{#if routes && routes.length > 0}
		<Table.Root class="grow basis-[334px]">
			<Table.Header>
				<Table.Row>
					<Table.Head class="text-left">Start</Table.Head>
					<Table.Head class="text-left">End</Table.Head>
					<Table.Head class="text-right" title="Route straight-line distance in meters">
						Dist.(m)
					</Table.Head>
					<Table.Head class="text-right" title="Ticketed times">TkT#</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each routes.slice((page - 1) * perPage, page * perPage) as route, i (i)}
					<Table.Row
						tabindex="0"
						on:mouseenter={() => hoverId.set(`${route.on_name} → ${route.off_name}`)}
						on:focus={() => hoverId.set(`${route.on_name} → ${route.off_name}`)}
					>
						<Table.Cell class="text-left">{route.on_name}</Table.Cell>
						<Table.Cell class="text-left">{route.off_name}</Table.Cell>
						<Table.Cell class="text-right">
							{route.distance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
						</Table.Cell>
						<Table.Cell class="text-right">{route.sum_of_txn_times}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<Pagination.Root
			count={routes.length}
			{perPage}
			bind:page
			let:pages
			let:currentPage
			class="shrink-0 justify-end"
		>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item isVisible={currentPage == page.value}>
							<Pagination.Link {page} isActive={currentPage == page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	{:else}
		<span>No routes</span>
	{/if}
{/await}
