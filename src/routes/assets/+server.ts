import { fetchAssets } from '@/sanity/client';

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

	const assets = await fetchAssets(tag, page);
	return new Response(JSON.stringify(assets), {
		headers: { 'Content-Type': 'application/json' }
	});
};
