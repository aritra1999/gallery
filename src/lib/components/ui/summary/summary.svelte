<script lang="ts">
	import type { Asset } from '$lib/types';

	let { assets }: { assets: Asset[] } = $props();
</script>

<div class="p-4">
	<p class="text-muted-foreground">Summary component - {assets.length} assets</p>
</div>
