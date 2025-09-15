<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';

	let status = $state($page.status);
	let error = $state($page.error);
</script>

<svelte:head>
	<title>{status} - Page Not Found | 30/30 Travel Gallery</title>
	<meta
		name="description"
		content="Sorry, the page you're looking for doesn't exist. Explore Aritra's travel gallery and discover amazing destinations from around the world."
	/>
	<meta name="robots" content="noindex, nofollow" />
	<meta property="og:title" content="{status} - Page Not Found | 30/30 Travel Gallery" />
	<meta
		property="og:description"
		content="Sorry, the page you're looking for doesn't exist. Explore our travel gallery instead."
	/>
	<meta property="og:url" content="https://30u30.vercel.app{$page.url.pathname}" />
	<meta property="og:type" content="website" />
	<meta name="twitter:title" content="{status} - Page Not Found | 30/30 Travel Gallery" />
	<meta
		name="twitter:description"
		content="Sorry, the page you're looking for doesn't exist. Explore our travel gallery instead."
	/>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": "{status} Error - 30/30 Travel Gallery",
			"description": "Error page for 30/30 Travel Gallery",
			"url": "https://30u30.vercel.app{$page.url.pathname}",
			"isPartOf": {
				"@type": "WebSite",
				"name": "30/30 Travel Gallery",
				"url": "https://30u30.vercel.app"
			},
			"mainEntity": {
				"@type": "Thing",
				"name": "{status} Error"
			}
		}
	</script>
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
	<div class="mb-8">
		<h1 class="header mb-4 text-6xl font-bold text-foreground">{status}</h1>
		{#if status === 404}
			<h2 class=" mb-6 text-2xl font-semibold">Page Not Found</h2>
			<p class="mb-6 max-w-md text-sm text-muted-foreground">
				Looks like you've wandered off the beaten path! The page you're looking for doesn't exist,
				but there are plenty of amazing destinations to explore in our gallery.
			</p>
		{:else if status === 500}
			<h2 class="mb-6 text-2xl font-semibold">Server Error</h2>
			<p class="mb-6 max-w-md text-muted-foreground">
				Oops! Something went wrong on our end. We're working to fix this issue.
			</p>
		{:else}
			<h2 class="mb-2 text-2xl font-semibold">Something went wrong</h2>
			<p class="mb-6 max-w-md text-muted-foreground">
				{error?.message || 'An unexpected error occurred.'}
			</p>
		{/if}
	</div>

	<div class="flex flex-col gap-4 sm:flex-row">
		<Button href="/" variant="outline" class="px-6 py-2">Go Home</Button>
	</div>
</div>
