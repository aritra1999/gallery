export function summerizeTags(tags: string[]): Record<string, string[]> {
	return tags.reduce(
		(acc, tag) => {
			if (tag === 'Wallpaper') return acc;

			const [region, country] = tag.split(',');
			if (country in acc) acc[country].push(region);
			else acc[country] = [region];

			return acc;
		},
		{} as Record<string, string[]>
	);
}
