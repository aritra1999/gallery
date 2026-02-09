import { createClient } from '@sanity/client';
import {
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_API_VERSION
} from '$env/static/public';
import { SANITY_TOKEN } from '$env/static/private';
import type { Asset } from '$lib/types';
import { PAGE_SIZE } from '@/constants';

export const client = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: PUBLIC_SANITY_API_VERSION,
	useCdn: true,
	token: SANITY_TOKEN
});

export async function fetchTags(): Promise<string[]> {
	const query = `{
    "items": *[
      _type == "media.tag"
      && !(_id in path("drafts.**"))
    ] {
      name
    } | order(name.current asc),
  }`;

	return await client
		.fetch(query)
		.then((result) => {
			return result.items.map((item: { name: { current: string } }) => item.name.current);
		})
		.catch((error) => {
			console.error('Error fetching tags:', error);
			throw error;
		});
}

export async function fetchAssets(tag: string, page: number = 1): Promise<Asset[]> {
	const query = `{
      "items": *[
        _type in ["sanity.fileAsset","sanity.imageAsset"] && !(_id in path("drafts.**")) && "${tag}" in opt.media.tags[]->name.current
      ] {
        _id,
        _createdAt,
        _updatedAt,
        mimeType,
        "tags": opt.media.tags[]->name.current,
        size,
        url
      } | order(_createdAt desc) [${(page - 1) * PAGE_SIZE}...${page * PAGE_SIZE}]
    }`;

	return await client
		.fetch(query)
		.then((result) => result.items.map((item: Asset) => ({ ...item, tags: item.tags ?? [] })))
		.catch((error) => {
			console.error('Error fetching media assets:', error);
			throw error;
		});
}

export async function fetchAllAssets(): Promise<Asset[]> {
	const query = `{
      "items": *[
        _type in ["sanity.fileAsset","sanity.imageAsset"]
        && !(_id in path("drafts.**"))
        && defined(metadata.location.lat)
        && defined(metadata.location.lng)
      ] {
        _id,
        _createdAt,
        _updatedAt,
        mimeType,
        "tags": opt.media.tags[]->name.current,
        "lat": metadata.location.lat,
        "lng": metadata.location.lng,
        size,
        url
      } | order(_createdAt desc)
    }`;

	return await client
		.fetch(query)
		.then((result) => result.items.map((item: Asset) => ({ ...item, tags: item.tags ?? [] })))
		.catch((error) => {
			console.error('Error fetching media assets:', error);
			throw error;
		});
}
