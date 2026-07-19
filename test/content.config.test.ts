import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import { collections } from '../src/content.config';

// The blog collection's `schema` is a function of `{ image }` (Astro injects an
// image helper at build time). We supply a stand-in that mimics the shape Astro
// provides so the resulting zod schema can be exercised directly.
const imageStub = () => z.object({ src: z.string() });
const blogSchema = () =>
	(collections.blog.schema as (ctx: { image: typeof imageStub }) => z.ZodTypeAny)({
		image: imageStub,
	});

const baseFrontmatter = {
	title: 'Hello world',
	description: 'A first post',
	pubDate: '2024-01-02',
};

describe('content.config collections', () => {
	it('defines a single "blog" collection', () => {
		expect(Object.keys(collections)).toEqual(['blog']);
	});

	it('loads markdown/mdx from the blog content directory', () => {
		expect(collections.blog.loader).toMatchObject({
			base: './src/content/blog',
			pattern: '**/*.{md,mdx}',
		});
	});

	it('accepts valid frontmatter and coerces pubDate to a Date', () => {
		const parsed = blogSchema().parse(baseFrontmatter);
		expect(parsed.title).toBe('Hello world');
		expect(parsed.description).toBe('A first post');
		expect(parsed.pubDate).toBeInstanceOf(Date);
		expect(parsed.pubDate.toISOString()).toBe('2024-01-02T00:00:00.000Z');
	});

	it('treats updatedDate and heroImage as optional', () => {
		const parsed = blogSchema().parse(baseFrontmatter);
		expect(parsed.updatedDate).toBeUndefined();
		expect(parsed.heroImage).toBeUndefined();

		const withOptional = blogSchema().parse({
			...baseFrontmatter,
			updatedDate: '2024-02-03',
			heroImage: { src: '/img/hero.png' },
		});
		expect(withOptional.updatedDate).toBeInstanceOf(Date);
		expect(withOptional.heroImage).toEqual({ src: '/img/hero.png' });
	});

	it('rejects frontmatter missing required fields', () => {
		expect(() => blogSchema().parse({ description: 'no title' })).toThrow();
		expect(() =>
			blogSchema().parse({ title: 'x', description: 'y' }),
		).toThrow();
	});

	it('rejects an unparseable pubDate', () => {
		expect(() =>
			blogSchema().parse({ ...baseFrontmatter, pubDate: 'not-a-date' }),
		).toThrow();
	});
});
