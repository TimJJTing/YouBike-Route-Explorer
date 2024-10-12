<script>
	import { createEventDispatcher } from 'svelte';
	import Close from './close.svelte';
	const dispatch = createEventDispatcher();
</script>

<div
	class="absolute right-0 top-0 m-6"
	role="button"
	tabindex="0"
	title="close"
	on:click={() => dispatch('click')}
	on:keydown|preventDefault={(e) => {
		if (e.key === 'Enter') dispatch('click');
	}}
>
	<Close />
</div>
