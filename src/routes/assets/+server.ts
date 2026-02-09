import { fetchAssets } from '@/sanity/client';
import { error } from '@sveltejs/kit';

export const GET = async ({ request }) => {
	const url = new URL(request.url);
	const tag = url.searchParams.get('t');

	if (!tag) {
		return new Response(JSON.stringify({ error: 'Tag parameter is missing' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const page = parseInt(url.searchParams.get('page') || '1', 10);

	try {
		const assets = await fetchAssets(tag, page);
		return new Response(JSON.stringify(assets), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Error fetching assets:', err);
		throw error(500, 'Failed to fetch assets');
	}
};
