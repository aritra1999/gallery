<script lang="ts">
	import type { Asset } from '@/types.js';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Background from '$lib/components/ui/landing/background.svelte';

	let { data } = $props();
	let page = $state(1);
	let loading = $state(false);
	let assets = $state<Asset[]>(data.assets || []);
	let open = $state(false);
	let selectedAsset = $state<Asset | null>(null);

	async function loadNextPage() {
		console.log('Function called ');
		loading = true;
		await fetch(`/assets?t=${data.tag}&page=${++page}`)
			.then((res) => res.json())
			.then((body) => assets.push(...(body as Asset[])))
			.catch((err) => {
				console.log(err);
			});

		loading = false;
	}
</script>

<svelte:head>
	<title>30/30 - {data.tag}</title>
	<meta name="description" content="Explore the media gallery" />
</svelte:head>

<div class="my-16">
	<h1 class="header mb-8 text-4xl font-bold sm:text-5xl">
		{data.tag}
	</h1>
</div>

<div>
	{#if assets && assets.length > 0}
		<div class="columns-2 gap-2 md:columns-3 lg:columns-4 xl:columns-5">
			{#each assets as asset (asset._id)}
				<button
					onclick={() => {
						open = true;
						selectedAsset = asset;
					}}
				>
					<div class="group rounded-6xl relative z-20 mb-1 cursor-pointer overflow-hidden">
						{#if asset.mimeType.startsWith('video/')}
							<video
								controls={false}
								class="z-20 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
							>
								<source src={asset.url} type={asset.mimeType} />
								<track kind="captions" src="" label="No captions available" />
								Your browser does not support the video tag.
							</video>
						{:else}
							<img
								src={asset.url}
								alt={asset.url}
								loading="lazy"
								class="z-20 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
							/>
						{/if}
						{#if asset.tags && asset.tags.length > 0}
							<div class="absolute right-1.5 bottom-2 opacity-0 group-hover:opacity-100">
								{#each asset.tags as tag (`${tag}-${asset.id}`)}
									<span class="ml-1.5 bg-background px-3 py-1.5 text-xs font-medium shadow-sm">
										{tag}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</button>
			{/each}
		</div>
		<div class="z-20 mt-10 mb-96 flex justify-center">
			<Button class="z-20" variant="outline" onclick={loadNextPage} disabled={loading}>
				{#if loading}
					Loading...
				{:else}
					Load More
				{/if}
			</Button>
		</div>
	{:else}
		<p class="mt-20 text-center">No assets found.</p>
	{/if}
</div>

<Dialog.Root bind:open>
	<Dialog.Content fullscreen={true}>
		{#if selectedAsset}
			{#if selectedAsset.mimeType.startsWith('video/')}
				<video
					controls={true}
					class="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] rounded-lg object-contain md:max-h-[calc(100vh-4rem)] md:max-w-[calc(100vw-4rem)]"
				>
					<source src={selectedAsset.url} type={selectedAsset.mimeType} />
					<track kind="captions" src="" label="No captions available" />
					Your browser does not support the video tag.
				</video>
			{:else}
				<img
					src={selectedAsset.url}
					alt={selectedAsset.url}
					class="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] rounded-lg object-contain md:max-h-[calc(100vh-4rem)] md:max-w-[calc(100vw-4rem)]"
				/>
			{/if}
		{/if}
	</Dialog.Content>
</Dialog.Root>

<Background label={data.tag.split(',')[0]} />
