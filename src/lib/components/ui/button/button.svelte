<script>
	import { buttonVariants } from "./index.js";
	import { cn } from "$lib/utils.js";
	/** @type {import("svelte/elements").HTMLButtonAttributes & { variant?: import("./index.js").ButtonVariant; size?: import("./index.js").ButtonSize; ref?: HTMLButtonElement | null }} */
	let {
		class: className = undefined,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		type = "button",
		children = undefined,
		...restProps
	} = $props();
</script>

<button
	bind:this={ref}
	class={cn(buttonVariants({ variant, size }), className)}
	{type}
	{...restProps}
>
	{@render children?.()}
</button>
