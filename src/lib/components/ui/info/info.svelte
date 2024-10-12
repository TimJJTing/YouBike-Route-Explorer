<script>
    import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils.js';
	let className = undefined;
	export { className as class };
</script>

<div
	id="info"
	class={cn(
		'rounded-lg border bg-card bg-zinc-900 text-card-foreground shadow-sm',
		className
	)}
    transition:fade={{ delay: 250, duration: 300 }}
	{...$$restProps}
>
	<slot />
</div>

<style lang="scss">
	#info {
		width: 384px;
		height: 500px;
	}
</style>
