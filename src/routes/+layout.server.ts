import type { LayoutServerLoad } from './$types';
import { summerizeTags } from '@/sanity/utils';
import { fetchTags } from '@/sanity/client';

export const load: LayoutServerLoad = async () => {
	try {
		const tags = await fetchTags();
		const summery = summerizeTags(tags);

		return {
			summery
		};
	} catch (err) {
		console.error('Error loading tags for layout:', err);
		return {
			summery: {}
		};
	}
};
