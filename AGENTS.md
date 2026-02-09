# AGENTS.md - Coding Agent Guidelines

This document provides guidelines for AI coding agents working in this SvelteKit 5 photo gallery application.

## Technology Stack

- **Framework**: SvelteKit 5 with Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 4 with shadcn-svelte components and `tailwind-variants`
- **CMS**: Sanity.io headless CMS
- **Testing**: Vitest (unit/component) + Playwright (E2E)
- **Deployment**: Vercel

## Build/Lint/Test Commands

| Command               | Description                                      |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Start development server                         |
| `npm run build`       | Production build                                 |
| `npm run check`       | Type checking with svelte-check                  |
| `npm run check:watch` | Type checking in watch mode                      |
| `npm run lint`        | Check formatting (Prettier) and linting (ESLint) |
| `npm run format`      | Auto-format all files with Prettier              |

### Testing Commands

| Command                                   | Description                             |
| ----------------------------------------- | --------------------------------------- |
| `npm run test`                            | Run all tests (unit + E2E)              |
| `npm run test:unit`                       | Run unit tests with Vitest (watch mode) |
| `npm run test:unit -- --run`              | Run unit tests once (no watch)          |
| `npx vitest run src/path/to/file.test.ts` | Run a single test file                  |
| `npx vitest run -t "test name"`           | Run tests matching a pattern            |
| `npm run test:e2e`                        | Run Playwright E2E tests                |
| `npx playwright test e2e/demo.test.ts`    | Run a single E2E test file              |

### Test File Naming

- **Server-side unit tests**: `*.test.ts` or `*.spec.ts`
- **Client-side component tests**: `*.svelte.test.ts` or `*.svelte.spec.ts`
- **E2E tests**: Located in `e2e/` directory

## Project Structure

```
src/
├── app.css              # Global styles, TailwindCSS theme
├── app.d.ts             # TypeScript declarations
├── lib/
│   ├── components/ui/   # UI components (shadcn-svelte style)
│   ├── sanity/          # Sanity CMS client and utilities
│   ├── server/          # Server-only code
│   ├── types.ts         # Shared TypeScript types
│   ├── utils.ts         # Utility functions (cn helper)
│   └── constants.ts     # App constants
├── routes/              # SvelteKit routes (+page.svelte, +page.server.ts)
e2e/                     # Playwright E2E tests
```

## Code Style Guidelines

### Formatting (Prettier)

- **Indentation**: Tabs (not spaces)
- **Quotes**: Single quotes
- **Trailing commas**: None
- **Line width**: 100 characters
- **Semicolons**: Required

### Import Order and Patterns

```typescript
// 1. SvelteKit imports
import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';

// 2. Environment variables
import { PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';
import { SANITY_TOKEN } from '$env/static/private';

// 3. Path alias imports (prefer @/* for lib)
import type { Asset } from '@/types.js';
import { fetchAssets } from '@/sanity/client';

// 4. Component imports
import { Button } from '$lib/components/ui/button';
import * as Dialog from '$lib/components/ui/dialog/index.js';

// 5. External libraries
import { onMount } from 'svelte';
```

### Path Aliases

- `@/*` maps to `./src/lib/*` (preferred for lib imports)
- `$lib/*` also works for lib imports
- Always include `.js` extension for local imports in TypeScript

### Naming Conventions

| Element          | Convention           | Example                                    |
| ---------------- | -------------------- | ------------------------------------------ |
| Files            | kebab-case           | `dialog-content.svelte`, `+page.server.ts` |
| Components       | PascalCase           | `Button`, `Dialog`                         |
| Variables        | camelCase            | `selectedAsset`, `masonryWidth`            |
| Constants        | SCREAMING_SNAKE_CASE | `PAGE_SIZE`, `COUNTRIES`                   |
| Types/Interfaces | PascalCase           | `Asset`, `ButtonProps`                     |

### TypeScript Patterns

```typescript
// Type definitions with explicit types
export type Asset = {
	_id: string;
	mimeType: 'video/mp4' | 'image/jpeg' | 'image/png' | 'image/gif';
	tags: string[];
};

// Use 'type' keyword for type-only imports
import type { PageServerLoad } from '../$types';

// Function signatures with explicit return types
export async function fetchAssets(tag: string, page: number = 1): Promise<Asset[]> {}
```

### Svelte 5 Runes (IMPORTANT)

This project uses **Svelte 5 runes**, not Svelte 4 reactive syntax:

```svelte
<script lang="ts">
	// Props - use $props() instead of export let
	let { data } = $props();
	let { class: className, variant = 'default', ...restProps }: ButtonProps = $props();

	// Reactive state - use $state() instead of let
	let page = $state(1);
	let assets = $state<Asset[]>(data.assets || []);

	// Derived values - use $derived() instead of $:
	let nCols = $derived(calcCols(masonryWidth));

	// Side effects - use $effect() instead of $:
	$effect(() => {
		console.log('page changed:', page);
	});

	// Bindable props
	let ref = $bindable(null);
</script>
```

### Component Structure (shadcn-svelte pattern)

```svelte
<!-- Module script for types and variants -->
<script lang="ts" module>
	import { tv } from 'tailwind-variants';
	export const buttonVariants = tv({
		/* ... */
	});
	export type ButtonProps = {
		/* ... */
	};
</script>

<!-- Instance script for logic -->
<script lang="ts">
	let { class: className, variant = 'default', ...restProps }: ButtonProps = $props();
</script>

<!-- Template -->
<button class={cn(buttonVariants({ variant }), className)} {...restProps}>
	{@render children?.()}
</button>
```

### Error Handling

```typescript
// Server-side: Use SvelteKit error helper
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		const data = await fetchData();
		return { data };
	} catch (err) {
		console.error('Error loading data:', err);
		throw error(500, 'Failed to load data');
	}
};

// Client-side: Use try-catch with console.error
async function loadMore() {
	try {
		const response = await fetch('/api/data');
		// handle response
	} catch (err) {
		console.error('Error:', err);
	}
}
```

### TailwindCSS with cn() Helper

```typescript
import { cn } from '$lib/utils';

// Merge classes conditionally
<div class={cn('base-class', isActive && 'active-class', className)} />
```

### tailwind-variants for Component Variants

```typescript
import { tv } from 'tailwind-variants';

export const buttonVariants = tv({
	base: 'inline-flex items-center justify-center rounded-md',
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground',
			outline: 'border bg-background'
		},
		size: {
			default: 'h-9 px-4 py-2',
			sm: 'h-8 px-3'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
});
```

## Testing Patterns

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';

describe('utility function', () => {
	it('should return expected value', () => {
		expect(myFunction(input)).toBe(expected);
	});
});
```

### Component Tests (vitest-browser-svelte)

```typescript
import { page } from '@vitest/browser/context';
import { render } from 'vitest-browser-svelte';
import Component from './Component.svelte';

describe('Component', () => {
	it('should render correctly', async () => {
		render(Component, { props: { value: 'test' } });
		await expect.element(page.getByRole('button')).toBeInTheDocument();
	});
});
```

### E2E Tests (Playwright)

```typescript
import { expect, test } from '@playwright/test';

test('page loads correctly', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```

## Key Files Reference

- **Types**: `src/lib/types.ts`
- **Constants**: `src/lib/constants.ts`
- **Utilities**: `src/lib/utils.ts`
- **Sanity Client**: `src/lib/sanity/client.ts`
- **UI Components**: `src/lib/components/ui/`
