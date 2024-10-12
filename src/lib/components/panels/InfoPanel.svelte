<script>
	import * as Info from '$lib/components/ui/info';
	import { focus } from '$lib/store';
</script>

{#if $focus.id}
	<Info.Root class="absolute left-0 top-0 m-8">
		<Info.Close on:click={() => focus.set({ id: null, name: null })} />
		<Info.Header>
			<Info.Title>{$focus.name}</Info.Title>
		</Info.Header>
		<Info.Content></Info.Content>
	</Info.Root>
{/if}
