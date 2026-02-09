<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import Info from '@lucide/svelte/icons/info';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { LayoutData } from './$types';

	interface Props {
		children?: import('svelte').Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	let showAboutModal = $state(false);
	const countryCount = $derived(data?.summery ? Object.keys(data.summery).length : 0);

	function openAboutModal() {
		showAboutModal = true;
	}

	function closeAboutModal() {
		showAboutModal = false;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<header class="fixed top-0 left-1/2 z-50 w-full -translate-x-1/2 bg-transparent">
	<nav
		class="container mx-auto mt-4 h-16 rounded-lg bg-background shadow-lg backdrop-blur-sm"
		aria-label="Main navigation"
	>
		<div class="flex h-full items-center justify-between pr-3 pl-2">
			<div>
				<a
					href={resolve('/')}
					class="header flex h-16 items-center px-4 text-2xl font-bold"
					aria-label="30/30 Travel Gallery - Home">30/30</a
				>
			</div>
			<div class="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					aria-label="About this gallery"
					onclick={openAboutModal}
				>
					<Info class="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
					<span class="sr-only">About</span>
				</Button>
				<Button
					onclick={toggleMode}
					variant="ghost"
					size="icon"
					aria-label="Toggle dark/light mode"
				>
					<SunIcon
						class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
						aria-hidden="true"
					/>
					<MoonIcon
						class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
						aria-hidden="true"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
		</div>
	</nav>
</header>

<main>
	{@render children?.()}
</main>

<!-- About modal -->
{#if showAboutModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
		onclick={(e) => e.target === e.currentTarget && closeAboutModal()}
		onkeydown={(e) => e.key === 'Escape' && closeAboutModal()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-background p-6 shadow-lg"
		>
			<!-- Close button -->
			<button
				class="absolute top-4 right-4 z-10 rounded-full bg-muted p-1.5 shadow-lg transition-colors hover:bg-muted/80"
				onclick={closeAboutModal}
				aria-label="Close modal"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<h2 class="header mb-4 text-2xl font-bold">hey i'm aritra!</h2>
			<p class="mb-6 text-sm text-muted-foreground">
				A software engineer by profession. I have a goal of visiting 30 countries before I turn 30.
				This is my collection of over saturated photos and videos I've taken over the years with my
				phone. Feel free to browse through and enjoy the memories captured in these moments.
			</p>

			<p class="header mb-4 text-xl font-bold">{countryCount} / 30 countries</p>

			{#if data.summery}
				<div class="flex flex-wrap gap-2">
					{#each Object.keys(data.summery) as country (country)}
						<span class="rounded-md bg-muted px-3 py-1.5 text-sm font-medium">
							{country}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
