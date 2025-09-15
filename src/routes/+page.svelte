<script lang="ts">
	import Background from '@/components/ui/landing/background.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>30/30 Travel Gallery - Aritra's Journey to 30 Countries</title>
	<meta
		name="description"
		content="Follow Aritra's journey to visit 30 countries before turning 30. Explore stunning travel photography and stories from around the world in this personal media gallery."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://30u30.vercel.app/" />
	<meta property="og:title" content="30/30 Travel Gallery - Aritra's Journey to 30 Countries" />
	<meta
		property="og:description"
		content="Follow Aritra's journey to visit 30 countries before turning 30. Explore stunning travel photography and stories from around the world."
	/>
	<meta
		property="og:image"
		content="https://cdn.sanity.io/images/b74xb8a5/production/d686a7e6b4fd1ec6c9584ac6a56a4b22a7765e05-1560x1244.png?w=1200"
	/>
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="958" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content="30/30 Travel Gallery" />
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://30u30.vercel.app/" />
	<meta
		property="twitter:title"
		content="30/30 Travel Gallery - Aritra's Journey to 30 Countries"
	/>
	<meta
		property="twitter:description"
		content="Follow Aritra's journey to visit 30 countries before turning 30. Explore stunning travel photography and stories from around the world."
	/>
	<meta
		property="twitter:image"
		content="https://cdn.sanity.io/images/b74xb8a5/production/d686a7e6b4fd1ec6c9584ac6a56a4b22a7765e05-1560x1244.png?w=1200"
	/>
	<meta
		name="keywords"
		content="travel photography, travel blog, 30 countries, travel gallery, world travel, adventure photography, travel stories, wanderlust, travel inspiration"
	/>
	<meta name="language" content="English" />
	<meta name="revisit-after" content="7 days" />
	<meta name="classification" content="Travel, Photography, Personal Blog" />
	<link rel="canonical" href="https://30u30.vercel.app/" />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Blog",
			"name": "30/30 Travel Gallery",
			"description": "Personal travel gallery documenting the journey to visit 30 countries before turning 30",
			"url": "https://30u30.vercel.app",
			"author": {
				"@type": "Person",
				"name": "Aritra",
				"description": "Software engineer"
			},
			"blogPost": [],
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "https://30u30.vercel.app/"
			},
			"publisher": {
				"@type": "Person",
				"name": "Aritra"
			},
			"genre": ["Travel", "Photography", "Adventure"],
			"keywords": "travel photography, world travel, 30 countries, travel blog, adventure"
		}
	</script>
</svelte:head>

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
		<p class="font-base text-xs sm:text-base">Countries Visited</p>
	</div>
</div>

<div>
	{#each Object.entries(data.summery) as [country, places] (country)}
		<div class="my-12">
			<h2 class="header mb-4 text-2xl font-bold sm:text-2xl">{country}</h2>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
				{#each places as place (place)}
					<a
						href="/explore?t={place},{country}"
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
