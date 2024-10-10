<script>
	import { onMount } from 'svelte';
	import { DuckDB } from '$lib/DuckDB';
	import { database } from './store';
	/**
	 * @type {{ name: string; url: string; }[]}
	 */
	export let connections = [];
	onMount(() => {
		database.update(() => new DuckDB(connections));
		return () => {
			if ($database) {
				$database.disconnect();
			}
		};
	});
</script>

{#await $database?.connect()}
	Loading...
{:then conn}
	<slot></slot>
{/await}
