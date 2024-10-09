<script>
	import '../app.css';
</script>

<div class="app">
	<main>
		<slot></slot>
	</main>
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
