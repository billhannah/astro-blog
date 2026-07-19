// Stub for `astro/loaders`, used only in unit tests. Returns a plain object
// describing the loader configuration so it can be asserted against without
// touching the file system.
export function glob(config: { base: string; pattern: string }) {
	return { name: 'glob-loader', ...config };
}
