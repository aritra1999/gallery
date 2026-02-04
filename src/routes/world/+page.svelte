<script lang="ts">
	import { Map, MapMarker, MarkerContent } from '$lib/components/ui/map';
	import Modal from '$lib/components/ui/modal/modal.svelte';
	import type { Asset } from '$lib/types';

	type AssetWithLocation = Asset & { lat: number; lng: number };
	type LocationGroup = {
		key: string;
		lat: number;
		lng: number;
		assets: AssetWithLocation[];
	};

	let { data } = $props();

	// Filter assets with valid coordinates
	const assetsWithLocation = $derived(
		data.assets.filter(
			(asset): asset is AssetWithLocation =>
				asset.lat !== undefined && asset.lng !== undefined
		)
	);

	// Group assets by location (using a precision of ~11m which is 4 decimal places)
	const groupedByLocation = $derived.by(() => {
		const groups: Record<string, LocationGroup> = {};

		for (const asset of assetsWithLocation) {
			// Round to 4 decimal places for grouping (~11m precision)
			const roundedLat = Math.round(asset.lat * 10000) / 10000;
			const roundedLng = Math.round(asset.lng * 10000) / 10000;
			const key = `${roundedLat},${roundedLng}`;

			if (groups[key]) {
				groups[key].assets.push(asset);
			} else {
				groups[key] = {
					key,
					lat: roundedLat,
					lng: roundedLng,
					assets: [asset]
				};
			}
		}

		return Object.values(groups);
	});

	// Track selected location group for gallery modal
	let selectedGroup = $state<LocationGroup | null>(null);
	let currentIndex = $state(0);
	let showModal = $state(false);

	// Derived current asset from selected group and index
	const currentAsset = $derived(
		selectedGroup ? selectedGroup.assets[currentIndex] : null
	);

	function handleMarkerClick(group: LocationGroup) {
		selectedGroup = group;
		currentIndex = 0;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedGroup = null;
		currentIndex = 0;
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
		{#each groupedByLocation as group (group.key)}
			{@const firstAsset = group.assets[0]}
			{@const count = group.assets.length}
			<MapMarker
				latitude={group.lat}
				longitude={group.lng}
				onclick={() => handleMarkerClick(group)}
			>
				<MarkerContent class="cursor-pointer transition-transform hover:scale-110">
					<div class="relative">
						<!-- Stacked cards effect for multiple assets -->
						{#if count > 1}
							<div
								class="absolute left-1 top-1 h-12 w-12 rounded-md border-2 border-white bg-gray-200 shadow md:h-16 md:w-16"
							></div>
							{#if count > 2}
								<div
									class="absolute left-0.5 top-0.5 h-12 w-12 rounded-md border-2 border-white bg-gray-300 shadow md:h-16 md:w-16"
								></div>
							{/if}
						{/if}

						<!-- Main thumbnail -->
						<div class="relative rounded-md border-2 border-white bg-white p-0.5 shadow-lg">
							{#if firstAsset.mimeType.startsWith('video')}
								<video
									src={firstAsset.url}
									class="h-12 w-12 rounded object-cover md:h-16 md:w-16"
									muted
									playsinline
									preload="metadata"
								></video>
							{:else}
								<img
									src="{firstAsset.url}?w=128&h=128&fit=crop"
									alt=""
									class="h-12 w-12 rounded object-cover md:h-16 md:w-16"
									loading="lazy"
								/>
							{/if}

							<!-- Count badge -->
							{#if count > 1}
								<div
									class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white shadow-md md:h-6 md:w-6 md:text-sm"
								>
									{count}
								</div>
							{/if}
						</div>
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
