import type { PageServerLoad } from '../$types';
import { error } from '@sveltejs/kit';
import { fetchAssets } from '@/sanity/client';

export const load: PageServerLoad = async ({ url }) => {
	const tag = url.searchParams.get('t');
	if (!tag) {
		throw error(400, 'Tag parameter is missing');
	}

	const assets = await fetchAssets(tag);

	return {
		assets,
		tag
	};
};
