<script>
	import '../app.css';
	// import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="app">
	<!-- <Header /> -->

	<main>
		<slot></slot>
	</main>

	<!-- <footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer> -->
</div>

<style>
	.app {
		min-height: 100vh;
	}

	main {
		width: 100vw;
		height: 100vh;
		margin: 0 auto;
		box-sizing: border-box;
	}
	/* 
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	} */
</style>
