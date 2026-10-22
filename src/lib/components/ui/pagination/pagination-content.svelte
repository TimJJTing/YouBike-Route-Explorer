<script>
	import { cn } from "$lib/utils.js";
	/** @type {import("svelte/elements").HTMLAttributes<HTMLUListElement>} */
	let { class: className = undefined, children = undefined, ...restProps } = $props();
</script>

<ul class={cn("flex flex-row items-center gap-1", className)} {...restProps}>
	{@render children?.()}
</ul>
