import type { CollectionEntry } from 'astro:content';

// Canonical permalink for a blog post entry.
export function getPostPath(post: CollectionEntry<'blog'>): string {
	return `/blog/${post.id}/`;
}
