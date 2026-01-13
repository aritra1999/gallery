<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { SunIcon, MoonIcon, Search } from '@lucide/svelte';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	let { children } = $props();

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<nav class="fixed top-2 z-50 mx-auto h-16 w-screen px-2 sm:top-4" aria-label="Main navigation">
	<div
		class="container mx-auto flex items-center justify-between rounded-lg bg-background px-4 shadow-sm"
	>
		<div>
			<a
				href="/"
				class="header flex h-16 items-center px-4 text-2xl font-bold"
				aria-label="30/30 Travel Gallery - Home">30/30</a
			>
		</div>
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" aria-label="Search">
				<Search />
			</Button>
			<Button onclick={toggleMode} variant="ghost" size="icon" aria-label="Toggle dark/light mode">
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

<!-- <main class="container mx-auto p-2"> -->
{@render children?.()}
<!-- </main> -->
