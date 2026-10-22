<script>
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import ChevronLeft from "@lucide/svelte/icons/chevron-left";
	import { buttonVariants } from "#lib/components/ui/button/index.js";
	import { cn } from "#lib/utils.js";
	/** @type {import("bits-ui").PaginationPrevButtonProps} */
	let { class: className = undefined, ref = $bindable(null), children = undefined, ...restProps } = $props();
</script>

{#snippet fallback()}
	<ChevronLeft class="h-4 w-4" />
{/snippet}

<PaginationPrimitive.PrevButton
	bind:ref
	class={cn(buttonVariants({ variant: "ghost" }), "gap-1 pl-2.5", className)}
	children={children || fallback}
	{...restProps}
/>
