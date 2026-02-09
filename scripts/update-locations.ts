/**
 * Script to update Sanity assets with missing lat/lng values based on their tags.
 * Tags are expected to be in the format "city, country".
 * Uses Nominatim (OpenStreetMap) API for geocoding.
 *
 * Usage: bun scripts/update-locations.ts [--dry-run]
 *
 * Options:
 *   --dry-run  Preview changes without actually updating Sanity
 */

import { createClient } from '@sanity/client';

type Asset = {
	_id: string;
	_type: string;
	originalFilename?: string;
	tags?: string[];
	hasLocation: boolean;
};

type GeocodingResult = {
	lat: number;
	lng: number;
	displayName: string;
};

type NominatimResponse = {
	lat: string;
	lon: string;
	display_name: string;
}[];

const geocodeCache = new Map<string, GeocodingResult | null>();

const dryRun = process.argv.includes('--dry-run');

const requiredEnvVars = [
	'PUBLIC_SANITY_PROJECT_ID',
	'PUBLIC_SANITY_DATASET',
	'PUBLIC_SANITY_API_VERSION',
	'SANITY_TOKEN'
] as const;

for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		console.error(`Error: Missing required environment variable: ${envVar}`);
		process.exit(1);
	}
}

const client = createClient({
	projectId: process.env.PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.PUBLIC_SANITY_DATASET!,
	apiVersion: process.env.PUBLIC_SANITY_API_VERSION!,
	token:
		'skgJPzKB2F8jL21M0MQgvaJVSD1cbEHcOTvU2t6Jx9tT5kx5507KHN9IVInS4EpXxIIKVvQASMjFSDECEyo2Qt5kwFfA7d1svu8O4ZdXiJWxVB8iaE9yETHgjgF1yrKcnMe9d5i7TrmyagFp52q89pMBRaXEW4tPp5BWLi10HLGfgUirXxsv'
});

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Geocode a location using Nominatim (OpenStreetMap) API
 * Rate limited to 1 request per second as per Nominatim usage policy
 */
async function geocode(query: string): Promise<GeocodingResult | null> {
	if (geocodeCache.has(query)) {
		return geocodeCache.get(query) ?? null;
	}

	url.searchParams.set('q', query);
	url.searchParams.set('format', 'json');
	url.searchParams.set('limit', '1');

	try {
		const response = await fetch(url.toString(), {
			headers: {
				'User-Agent': 'SanityAssetLocationUpdater/1.0'
			}
		});

		if (!response.ok) {
			console.error(`  Geocoding API error: ${response.status} ${response.statusText}`);
			geocodeCache.set(query, null);
			return null;
		}

		const data = (await response.json()) as NominatimResponse;

		if (data.length === 0) {
			geocodeCache.set(query, null);
			return null;
		}

		const result: GeocodingResult = {
			lat: parseFloat(data[0].lat),
			lng: parseFloat(data[0].lon),
			displayName: data[0].display_name
		};

		geocodeCache.set(query, result);

		await sleep(1000);

		return result;
	} catch (err) {
		console.error(`  Geocoding error: ${err instanceof Error ? err.message : err}`);
		geocodeCache.set(query, null);
		return null;
	}
}

/**
 * Find a location tag from the asset's tags
 * Returns the first tag that looks like "city, country" format
 */
function findLocationTag(tags?: string[]): string | null {
	if (!tags || !Array.isArray(tags)) return null;

	for (const tag of tags) {
		if (tag.includes(',')) {
			return tag;
		}
	}
	return null;
}

/**
 * Fetch all assets without lat/lng from Sanity
 */
async function fetchAssetsWithoutLocation(): Promise<Asset[]> {
	const query = `*[
    _type in ["sanity.fileAsset", "sanity.imageAsset"]
    && !(_id in path("drafts.**"))
    && (!defined(metadata.location.lat) || !defined(metadata.location.lng))
  ] {
    _id,
    _type,
    originalFilename,
    "tags": opt.media.tags[]->name.current,
    "hasLocation": defined(metadata.location)
  }`;

	return client.fetch(query);
}

/**
 * Update an asset's location in Sanity
 */
async function updateAssetLocation(assetId: string, lat: number, lng: number) {
	return client
		.patch(assetId)
		.set({
			'metadata.location': {
				_type: 'geopoint',
				lat,
				lng
			}
		})
		.commit();
}

/**
 * Main function
 */
async function main() {
	console.log('='.repeat(60));
	console.log('Sanity Asset Location Updater (using Nominatim geocoding)');
	console.log('='.repeat(60));

	if (dryRun) {
		console.log('\n** DRY RUN MODE - No changes will be made **\n');
	}

	console.log('Note: Nominatim has a rate limit of 1 request/second.\n');

	console.log('Fetching assets without lat/lng...');
	const assets = await fetchAssetsWithoutLocation();
	console.log(`Found ${assets.length} assets without location data.\n`);

	if (assets.length === 0) {
		console.log('No assets to update. Exiting.');
		return;
	}

	let updated = 0;
	let skipped = 0;
	let errors = 0;
	const skippedAssets: Array<{ id: string; filename?: string; tags?: string[] }> = [];

	for (const asset of assets) {
		const locationTag = findLocationTag(asset.tags);

		if (!locationTag) {
			skipped++;
			skippedAssets.push({
				id: asset._id,
				filename: asset.originalFilename,
				tags: asset.tags
			});
			continue;
		}

		console.log(`[${asset._id}] ${asset.originalFilename || 'unnamed'}`);
		console.log(`  Tag: "${locationTag}"`);

		const coordinates = await geocode(locationTag);

		if (coordinates) {
			console.log(`  Found: ${coordinates.displayName}`);
			console.log(`  Coordinates: ${coordinates.lat}, ${coordinates.lng}`);

			if (!dryRun) {
				try {
					await updateAssetLocation(asset._id, coordinates.lat, coordinates.lng);
					console.log('  Status: Updated successfully');
					updated++;
				} catch (err) {
					console.error(`  Status: ERROR - ${err instanceof Error ? err.message : err}`);
					errors++;
				}
			} else {
				console.log('  Status: Would be updated (dry run)');
				updated++;
			}
		} else {
			console.log('  Status: Could not geocode location');
			skipped++;
			skippedAssets.push({
				id: asset._id,
				filename: asset.originalFilename,
				tags: asset.tags
			});
		}
		console.log('');
	}

	console.log('='.repeat(60));
	console.log('Summary');
	console.log('='.repeat(60));
	console.log(`Total assets processed: ${assets.length}`);
	console.log(`Updated: ${updated}`);
	console.log(`Skipped (no location tag or geocoding failed): ${skipped}`);
	if (!dryRun) {
		console.log(`Errors: ${errors}`);
	}

	if (skippedAssets.length > 0) {
		console.log('\nSkipped assets:');
		for (const asset of skippedAssets) {
			console.log(`  - ${asset.filename || asset.id}`);
			console.log(`    Tags: ${asset.tags?.join(', ') || 'none'}`);
		}
	}

	console.log(`\nGeocoding cache: ${geocodeCache.size} unique locations looked up`);
}

main().catch((err) => {
	console.error('Fatal error:', err);
	process.exit(1);
});
