export type Asset = {
	_id: string;
	_createdAt: string;
	_updatedAt: string;
	mimeType: 'video/mp4' | 'image/jpeg' | 'image/png' | 'image/gif';
	tags: string[];
	lat?: number;
	lng?: number;
	size: number;
	url: string;
};
