<script>
	/** @type {import("svelte/elements").HTMLLiAttributes} */
	let { children = undefined, ...restProps } = $props();
</script>

<li {...restProps}>
	{@render children?.()}
</li>
