<script>
	import { cn } from "#lib/utils.js";
	let className = undefined;
	export { className as class };
</script>

<thead class={cn("[&_tr]:border-b", className)} {...$$restProps} on:click on:keydown>
	<slot />
</thead>
