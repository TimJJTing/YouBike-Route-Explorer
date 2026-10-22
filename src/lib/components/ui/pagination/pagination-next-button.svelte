<script>
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	/** @type {import("bits-ui").PaginationNextButtonProps} */
	let { class: className = undefined, ref = $bindable(null), children = undefined, ...restProps } = $props();
</script>

{#snippet fallback()}
	<ChevronRight class="h-4 w-4" />
{/snippet}

<PaginationPrimitive.NextButton
	bind:ref
	class={cn(buttonVariants({ variant: "ghost" }), "gap-1 pr-2.5", className)}
	children={children || fallback}
	{...restProps}
/>
