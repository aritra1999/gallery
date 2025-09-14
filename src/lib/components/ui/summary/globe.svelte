<script lang="ts">
	import { onMount } from 'svelte';
	import createGlobe, { type Marker } from 'cobe';
	import { Spring } from 'svelte/motion';
	import { cn } from '$lib/utils';
	import { COUNTRIES } from '@/constants';
	import type { Asset } from '$lib/types';

	let { assets }: { assets: Asset[] } = $props();
	let pointerInteracting = $state<number | null>(null);
	let pointerInteractionMovement = $state(0);
	let phi = $state(0);
	let width = $state(0);
	let canvas: HTMLCanvasElement;

	let x = new Spring(0, {
		stiffness: 0.04,
		damping: 0.4,
		precision: 0.005
	});

	let onRender = (state: Record<string, unknown>) => {
		if (!pointerInteracting) {
			phi += 0.005;
		}
		state.phi = phi + x.current;
		state.width = width * 2;
		state.height = width * 2;
	};

	let getMarkers = (assets: Asset[]): Marker[] => {
		const assetMap: Record<string, number> = {};
		const countriesSet = new Set(COUNTRIES.map((c) => c.name));

		assets.forEach((asset) => {
			if (asset.tags[0] && countriesSet.has(asset.tags[0])) assetMap[asset.tags[0]]++;
			if (asset.tags[1] && countriesSet.has(asset.tags[1])) assetMap[asset.tags[0]]++;
		});

		const markers = COUNTRIES.map((country) => {
			return { location: [country.lat, country.lng], size: assetMap[country.name] * 0.01 };
		}).filter((marker) => marker.size > 0) as Marker[];

		console.log(markers);

		return markers;
	};

	let onResize = () => {
		width = canvas.offsetWidth;
	};

	onMount(() => {
		window.addEventListener('resize', onResize);
		onResize();

		createGlobe(canvas, {
			devicePixelRatio: 2,
			width: width,
			height: width,
			phi: 0,
			theta: 0.3,
			dark: 1,
			diffuse: 0,
			mapSamples: 16000,
			mapBrightness: 6,
			baseColor: [0.3, 0.3, 0.3],
			markerColor: [251 / 255, 100 / 255, 21 / 255],
			glowColor: [1, 1, 1],
			markers: getMarkers(assets),
			onRender: onRender
		});

		return () => {
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<main class={cn('mx-auto aspect-[1/1] w-full max-w-[600px]')}>
	<canvas
		class="h-full w-full [contain:layout_paint_size]"
		bind:this={canvas}
		onpointerdown={(e) => {
			pointerInteracting = e.clientX - pointerInteractionMovement;
			canvas.style.cursor = 'grabbing';
		}}
		onpointerup={() => {
			pointerInteracting = null;
			canvas.style.cursor = 'grab';
		}}
		onpointerout={() => {
			pointerInteracting = null;
			canvas.style.cursor = 'grab';
		}}
		onmousemove={(e) => {
			if (pointerInteracting !== null) {
				const delta = e.clientX - pointerInteracting;
				pointerInteractionMovement = delta;
				x.set(delta / 200);
			}
		}}
	>
	</canvas>
</main>
