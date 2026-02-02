<script lang="ts">
	import { Map, MapMarker, MarkerContent } from '$lib/components/ui/map';
	import Modal from '$lib/components/ui/modal/modal.svelte';
	import type { Asset } from '$lib/types';

	let { data } = $props();

	// Filter assets with valid coordinates
	const assetsWithLocation = $derived(
		data.assets.filter(
			(asset): asset is Asset & { lat: number; lng: number } =>
				asset.lat !== undefined && asset.lng !== undefined
		)
	);

	// Track selected asset for full preview modal
	let selectedAsset = $state<(Asset & { lat: number; lng: number }) | null>(null);
	let showModal = $state(false);

	function handleMarkerClick(asset: Asset & { lat: number; lng: number }) {
		selectedAsset = asset;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}
</script>

<svelte:head>
	<title>World Map - 30/30 Travel Gallery</title>
	<meta
		name="description"
		content="Explore the world through an interactive map. View countries and places visited as part of the 30/30 travel journey."
	/>
</svelte:head>

<div class="flex h-screen w-full flex-col">
	<Map center={[0, 20]} zoom={2}>
		{#each assetsWithLocation as asset (asset._id)}
			<MapMarker
				latitude={asset.lat}
				longitude={asset.lng}
				onclick={() => handleMarkerClick(asset)}
			>
				<MarkerContent class="cursor-pointer transition-transform hover:scale-110">
					<div class="rounded-md border-2 border-white bg-white p-0.5 shadow-lg">
						{#if asset.mimeType.startsWith('video')}
							<video
								src={asset.url}
								class="h-12 w-12 rounded object-cover md:h-16 md:w-16"
								muted
								playsinline
								poster="{asset.url}?frame=1"
							></video>
						{:else}
							<img
								src="{asset.url}?w=128&h=128&fit=crop"
								alt=""
								class="h-12 w-12 rounded object-cover md:h-16 md:w-16"
								loading="lazy"
							/>
						{/if}
					</div>
				</MarkerContent>
			</MapMarker>
		{/each}
	</Map>
</div>

<!-- Full screen modal -->
<Modal
	isOpen={showModal}
	onClose={closeModal}
	asset={selectedAsset
		? {
				id: selectedAsset._id,
				url: selectedAsset.url,
				mimeType: selectedAsset.mimeType,
				tags: selectedAsset.tags
			}
		: null}
/>
