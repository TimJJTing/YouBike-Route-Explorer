<script>
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	/** @type {import("bits-ui").PaginationRootProps} */
	let {
		class: className = undefined,
		count = 0,
		perPage = 10,
		page = $bindable(1),
		siblingCount = 1,
		ref = $bindable(null),
		...restProps
	} = $props();
</script>

<PaginationPrimitive.Root
	bind:ref
	bind:page
	{count}
	{perPage}
	{siblingCount}
	class={cn("mx-auto flex w-full flex-col items-center", className)}
	{...restProps}
/>
