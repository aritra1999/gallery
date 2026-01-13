<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	let mapContainer: HTMLDivElement;
	let map: maplibregl.Map;

	onMount(() => {
		// Detect if dark mode is active
		const isDarkMode = document.documentElement.classList.contains('dark');

		// Toggle colors based on theme
		const landColor = isDarkMode ? '#d4d4d4' : '#2a2a2a'; // Light grey in dark mode, dark grey in light mode
		const waterColor = isDarkMode ? '#1a1a1a' : '#ffffff'; // Dark grey in dark mode, white in light mode

		// Initialize the map with a simplified black and white style
		map = new maplibregl.Map({
			container: mapContainer,
			style: {
				version: 8,
				sources: {
					'natural-earth': {
						type: 'geojson',
						data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson'
					}
				},
				layers: [
					{
						id: 'background',
						type: 'background',
						paint: {
							'background-color': waterColor
						}
					},
					{
						id: 'countries',
						type: 'fill',
						source: 'natural-earth',
						paint: {
							'fill-color': landColor,
							'fill-opacity': 1
						}
					},
					{
						id: 'country-borders',
						type: 'line',
						source: 'natural-earth',
						paint: {
							'line-color': waterColor,
							'line-width': 1
						}
					}
				]
			},
			center: [0, 20],
			zoom: 2,
			scrollZoom: true
		});

		// Clean up on component destroy
		return () => {
			map.remove();
		};
	});
</script>

<svelte:head>
	<title>World Map - 30/30 Travel Gallery</title>
	<meta
		name="description"
		content="Explore the world through an interactive map. View countries and places visited as part of the 30/30 travel journey."
	/>
</svelte:head>

<div class="flex h-screen w-full flex-col">
	<div bind:this={mapContainer} class="h-full w-full"></div>
</div>

<style>
	:global(.maplibregl-map) {
		font-family: 'Roboto Mono', monospace;
		background-color: var(--background);
	}

	:global(.maplibregl-canvas-container) {
		background-color: var(--background);
	}

	:global(.maplibregl-ctrl-bottom-left),
	:global(.maplibregl-ctrl-bottom-right) {
		display: flex;
		align-items: flex-end;
		margin: 0 0 1rem 1rem;
	}

	:global(.maplibregl-ctrl) {
		margin: 0;
	}

	:global(.maplibregl-ctrl-attrib) {
		background-color: var(--card) !important;
		color: var(--foreground) !important;
		border: 1px solid var(--border);
		font-size: 10px;
		font-family: 'Roboto Mono', monospace;
	}

	:global(.maplibregl-ctrl-attrib a) {
		color: var(--foreground) !important;
		text-decoration: underline;
	}

	:global(.maplibregl-ctrl-group) {
		background-color: var(--card) !important;
		border: 1px solid var(--border) !important;
		box-shadow: none !important;
	}

	:global(.maplibregl-ctrl-group button) {
		background-color: var(--card) !important;
		color: var(--foreground) !important;
		border-bottom: 1px solid var(--border) !important;
	}

	:global(.maplibregl-ctrl-group button:last-child) {
		border-bottom: none !important;
	}

	:global(.maplibregl-ctrl-group button:hover) {
		background-color: var(--accent) !important;
	}

	:global(.maplibregl-ctrl-group button + button) {
		border-top: 1px solid var(--border);
	}

	:global(.maplibregl-ctrl-icon) {
		filter: invert(var(--foreground));
	}
</style>
