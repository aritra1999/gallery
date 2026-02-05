<script lang="ts">
	import { Map, MapMarker, MarkerContent } from '$lib/components/ui/map';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
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
	let isMediaLoaded = $state(false);

	// Derived current asset from selected group and index
	const currentAsset = $derived(
		selectedGroup ? selectedGroup.assets[currentIndex] : null
	);

	function handleMarkerClick(group: LocationGroup) {
		selectedGroup = group;
		currentIndex = 0;
		isMediaLoaded = false;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedGroup = null;
		currentIndex = 0;
		isMediaLoaded = false;
	}

	function goToPrevious() {
		if (selectedGroup && currentIndex > 0) {
			isMediaLoaded = false;
			currentIndex--;
		}
	}

	function goToNext() {
		if (selectedGroup && currentIndex < selectedGroup.assets.length - 1) {
			isMediaLoaded = false;
			currentIndex++;
		}
	}

	function handleMediaLoad() {
		isMediaLoaded = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!showModal || !selectedGroup) return;

		if (event.key === 'ArrowLeft') {
			goToPrevious();
		} else if (event.key === 'ArrowRight') {
			goToNext();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

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
				zIndex={count > 1 ? 10 : 1}
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

<!-- Gallery modal with navigation -->
{#if showModal && currentAsset}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
		onclick={(e) => e.target === e.currentTarget && closeModal()}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Loading spinner -->
		{#if !isMediaLoaded}
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
			</div>
		{/if}

		<div class="relative max-h-[90vh] max-w-[90vw]" class:opacity-0={!isMediaLoaded}>
			<!-- Close button -->
			<button
				class="absolute -right-2 -top-2 z-10 rounded-full bg-white p-1.5 shadow-lg transition-colors hover:bg-gray-100"
				onclick={closeModal}
				aria-label="Close modal"
			>
				<svg class="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Navigation arrows for multiple assets -->
			{#if selectedGroup && selectedGroup.assets.length > 1}
				<!-- Previous button -->
				<button
					class="absolute left-0 top-1/2 z-10 -translate-x-12 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
					onclick={goToPrevious}
					disabled={currentIndex === 0}
					aria-label="Previous image"
				>
					<ChevronLeft class="h-6 w-6 text-gray-700" />
				</button>

				<!-- Next button -->
				<button
					class="absolute right-0 top-1/2 z-10 translate-x-12 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
					onclick={goToNext}
					disabled={currentIndex === selectedGroup.assets.length - 1}
					aria-label="Next image"
				>
					<ChevronRight class="h-6 w-6 text-gray-700" />
				</button>

				<!-- Counter -->
				<div class="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
					{currentIndex + 1} / {selectedGroup.assets.length}
				</div>
			{/if}

			<!-- Media content -->
			{#if currentAsset.mimeType.startsWith('video')}
				<video
					src={currentAsset.url}
					class="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
					controls
					autoplay
					playsinline
					onloadeddata={handleMediaLoad}
				>
					<track kind="captions" src="" label="No captions available" />
				</video>
			{:else}
				<img
					src="{currentAsset.url}?w=1920&h=1080&fit=max"
					alt=""
					class="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
					onload={handleMediaLoad}
				/>
			{/if}

			<!-- Tags -->
			{#if currentAsset.tags && currentAsset.tags.length > 0}
				<div class="absolute bottom-2 left-2 flex flex-wrap gap-1">
					{#each currentAsset.tags as tag}
						<span class="rounded bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
							{tag}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
