<script lang="ts">
	import Background from '@/components/ui/landing/background.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>About - 30/30 Travel Gallery</title>
	<meta
		name="description"
		content="Learn about Aritra's journey to visit 30 countries before turning 30. Browse countries and places visited."
	/>
</svelte:head>

<div class="container mx-auto p-2 pt-24">
<div
	class="my-12 flex flex-col divide-x-0 divide-y divide-foreground border border-foreground sm:my-20 sm:flex-row sm:divide-x sm:divide-y-0"
>
	<div class="w-full px-8 py-6 sm:w-3/5">
		<h1 class="header mb-4 text-3xl font-bold sm:text-4xl">hey i'm aritra!</h1>
		<p class="font-base text-xs sm:text-base">
			A software engineer by profession. I have a goal of visiting 30 countries before I turn 30.
			This is my collection of over saturated photos and videos I've taken over the years with my
			phone. Feel free to browse through and enjoy the memories captured in these moments.
		</p>
	</div>
	<div class="w-full px-8 py-6 sm:w-2/5">
		<h1 class="header mb-4 text-3xl font-bold sm:text-4xl">
			{Object.keys(data.summery).length} / 30
		</h1>
	</div>
</div>

<div>
	{#each Object.entries(data.summery) as [country, places] (country)}
		<div class="my-12">
			<h2 class="header mb-4 text-2xl font-bold sm:text-2xl">{country}</h2>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
				{#each places as place (place)}
					<a
						href="/explore?t={encodeURIComponent(`${place},${country}`)}"
						class="-mr-px -mb-px block border border-foreground bg-background p-4 transition-colors hover:bg-foreground hover:text-background"
					>
						{place}
					</a>
				{/each}
			</div>
		</div>
	{/each}
</div>

<Background label="30under30" />
</div>
