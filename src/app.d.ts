// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				username: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '$env/static/public' {
	export const PUBLIC_SANITY_PROJECT_ID: string;
	export const PUBLIC_SANITY_DATASET: string;
	export const PUBLIC_SANITY_API_VERSION: string;
}

declare module '$env/static/private' {
	export const SANITY_TOKEN: string;
	export const JWT_SECRET: string;
	export const ADMIN_USERNAME: string;
	export const ADMIN_PASSWORD_HASH: string;
}

export {};
