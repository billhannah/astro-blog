/// <reference types="vitest" />
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Astro exposes several virtual modules (e.g. `astro:content`) that are only
// available inside the Astro build pipeline. For unit tests we alias them to
// lightweight stubs so the source modules can be imported and their behavior
// mocked with `vi.mock`.
export default defineConfig({
	resolve: {
		alias: {
			'astro:content': fileURLToPath(
				new URL('./test/stubs/astro-content.ts', import.meta.url),
			),
			'astro/loaders': fileURLToPath(
				new URL('./test/stubs/astro-loaders.ts', import.meta.url),
			),
		},
	},
	test: {
		environment: 'node',
		include: ['test/**/*.{test,spec}.{js,ts}'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{js,ts}'],
			reporter: ['text', 'json-summary', 'html'],
		},
	},
});
