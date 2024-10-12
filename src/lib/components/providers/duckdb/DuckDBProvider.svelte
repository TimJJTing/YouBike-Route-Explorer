<script>
	import { onMount } from 'svelte';
	import { setDuckDB } from './context';
	/**
	 * @type {{ name: string; url: string; }[]}
	 */
	export let connections = [];

	let duckdb = setDuckDB(connections);

	onMount(() => {
		return () => {
			$duckdb?.disconnect();
		};
	});
</script>

{#await $duckdb?.connect()}
	Loading...
{:then conn}
	<slot></slot>
{/await}
