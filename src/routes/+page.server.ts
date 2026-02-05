import type { PageServerLoad } from './$types';

// Summary data is now loaded in +layout.server.ts and available via parent data
export const load: PageServerLoad = async () => {
	return {};
};
