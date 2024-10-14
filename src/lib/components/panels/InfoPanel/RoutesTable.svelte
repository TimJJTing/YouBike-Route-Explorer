<script>
	import * as Pagination from '$lib/components/ui/pagination';
	import { routesQuery } from '$lib/store';
	let page = 1;
	const perPage = 10;
</script>

{#await $routesQuery then routes}
	{#if routes && routes.length > 0}
		{#each routes.slice((page - 1) * perPage, page * perPage) as route, i (i)}
			<div>{route.on_name} → {route.off_name} : {route.sum_of_txn_times}</div>
		{/each}
		<Pagination.Root count={routes.length} {perPage} bind:page let:pages let:currentPage>
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
