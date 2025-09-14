<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { SunIcon, MoonIcon, Search } from '@lucide/svelte';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<nav class="fixed z-50 h-16 w-screen border-b border-foreground bg-background">
	<div class="container mx-auto flex items-center justify-between pr-3 pl-2">
		<div>
			<a href="/" class="header flex h-16 items-center px-4 text-2xl font-bold">30/30</a>
		</div>
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon">
				<Search />
			</Button>
			<Button onclick={toggleMode} variant="ghost" size="icon">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</div>
</nav>

<main class="container mx-auto p-2 pt-16">
	{@render children?.()}
</main>
