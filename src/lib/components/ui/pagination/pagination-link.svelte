<script>
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	/** @type {import("bits-ui").PaginationPageProps & { size?: import("$lib/components/ui/button/index.js").ButtonSize; isActive?: boolean }} */
	let {
		class: className = undefined,
		page,
		size = "icon",
		isActive = false,
		ref = $bindable(null),
		children = undefined,
		...restProps
	} = $props();
</script>

{#snippet fallback()}
	{page.value}
{/snippet}

<PaginationPrimitive.Page
	bind:ref
	{page}
	class={cn(
		buttonVariants({
			variant: isActive ? "outline" : "ghost",
			size
		}),
		className
	)}
	children={children || fallback}
	{...restProps}
/>
