<script lang="ts">
	import { X } from '@lucide/svelte';
	import { onMount } from 'svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		asset?: {
			id: string;
			url: string;
			mimeType: string;
			tags?: string[];
		} | null;
	}

	let { isOpen = false, onClose, asset = null }: Props = $props();

	let modalElement: HTMLDivElement;
	let isLoaded = $state(false);

	// Reset loaded state when asset changes
	$effect(() => {
		if (asset) {
			isLoaded = false;
		}
	});

	function handleMediaLoad() {
		isLoaded = true;
	}

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	// Handle click outside modal
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === modalElement) {
			onClose();
		}
	}

	onMount(() => {
		function handleGlobalKeydown(event: KeyboardEvent) {
			if (isOpen) {
				handleKeydown(event);
			}
		}

		document.addEventListener('keydown', handleGlobalKeydown);

		return () => {
			document.removeEventListener('keydown', handleGlobalKeydown);
		};
	});

	// Prevent body scroll when modal is open
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if isOpen && asset}
	<div
		bind:this={modalElement}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<!-- Loading spinner -->
		{#if !isLoaded}
			<div class="absolute inset-0 flex items-center justify-center">
				<div
					class="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"
				></div>
			</div>
		{/if}

		<div class="relative max-h-[90vh] max-w-[90vw]" class:opacity-0={!isLoaded}>
			<!-- Close button -->
			<button
				class="absolute -right-2 -top-2 z-10 rounded-full bg-white p-1.5 shadow-lg transition-colors hover:bg-gray-100"
				onclick={onClose}
				aria-label="Close modal"
			>
				<X class="h-5 w-5 text-gray-700" />
			</button>

			<!-- Media content -->
			{#if asset.mimeType.startsWith('video')}
				<video
					src={asset.url}
					class="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
					controls
					autoplay
					playsinline
					onloadeddata={handleMediaLoad}
				></video>
			{:else}
				<img
					src="{asset.url}?w=1920&h=1080&fit=max"
					alt=""
					class="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
					onload={handleMediaLoad}
				/>
			{/if}

			<!-- Tags -->
			{#if asset.tags && asset.tags.length > 0}
				<div class="absolute bottom-2 left-2 flex flex-wrap gap-1">
					{#each asset.tags as tag}
						<span class="rounded bg-black/50 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
							{tag}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
