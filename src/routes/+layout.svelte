<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { SunIcon, MoonIcon, Info } from '@lucide/svelte';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	let { children, data } = $props();

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	const countryCount = $derived(Object.keys(data.summery || {}).length);
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
			<Dialog.Root>
				<Dialog.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="icon" aria-label="About this gallery">
							<Info class="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
							<span class="sr-only">About</span>
						</Button>
					{/snippet}
				</Dialog.Trigger>
				<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-lg">
					<Dialog.Header>
						<Dialog.Title class="header text-2xl">hey i'm aritra!</Dialog.Title>
						<Dialog.Description>
							A software engineer by profession. I have a goal of visiting 30 countries before I
							turn 30. This is my collection of over saturated photos and videos I've taken over the
							years with my phone. Feel free to browse through and enjoy the memories captured in
							these moments.
						</Dialog.Description>
					</Dialog.Header>
					<div class="mt-4">
						<p class="header mb-4 text-xl font-bold">{countryCount} / 30 countries</p>
						{#if data.summery}
							<div class="space-y-4">
								{#each Object.entries(data.summery) as [country, places] (country)}
									<div>
										<h3 class="header mb-2 font-semibold">{country}</h3>
										<div class="flex flex-wrap gap-1">
											{#each places as place (place)}
												<a
													href="/explore?t={encodeURIComponent(`${place},${country}`)}"
													target="_blank"
													class="rounded-md bg-muted px-2 py-1 text-xs transition-colors hover:bg-foreground hover:text-background"
												>
													{place}
												</a>
											{/each}
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</Dialog.Content>
			</Dialog.Root>
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
