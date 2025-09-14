import type { PageServerLoad } from '../$types';
import { error } from '@sveltejs/kit';
import { summerizeTags } from '@/sanity/utils';
import { fetchTags } from '@/sanity/client';

export const load: PageServerLoad = async () => {
	try {
		const tags = await fetchTags();
		const summery = summerizeTags(tags);

		return {
			summery
		};
	} catch (err) {
		console.error('Error loading media URLs:', err);
		throw error(500, 'Failed to load media from Sanity');
	}
};
