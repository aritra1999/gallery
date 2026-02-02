import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { fetchAllAssets } from '@/sanity/client';

export const load: PageServerLoad = async () => {
	try {
		const assets = await fetchAllAssets();
		// console.log(assets);

		return {
			assets
		};
	} catch (err) {
		console.error('Error loading media assets:', err);
		throw error(500, 'Failed to load media from Sanity');
	}
};
