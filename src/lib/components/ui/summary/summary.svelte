<script lang="ts">
	import type { Asset } from '$lib/types';
	import { onMount } from 'svelte';
	// import Globe from './globe.svelte';

	let { assets }: { assets: Asset[] } = $props();
</script>

<div>
	<!-- <Globe {assets} /> -->
</div>
