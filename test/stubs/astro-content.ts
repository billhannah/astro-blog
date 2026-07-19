// Stub for the `astro:content` virtual module, used only in unit tests.
// Individual tests override these with `vi.mock('astro:content', ...)` when
// they need specific behavior.
export function defineCollection<T>(config: T): T {
	return config;
}

export async function getCollection(_collection: string): Promise<unknown[]> {
	return [];
}
