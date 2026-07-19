import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SITE_DESCRIPTION, SITE_TITLE } from '../src/consts';

const getCollection = vi.fn();
const rss = vi.fn((options) => ({ options, body: '<rss/>' }));

vi.mock('astro:content', () => ({ getCollection: (...args) => getCollection(...args) }));
vi.mock('@astrojs/rss', () => ({ default: (...args) => rss(...args) }));

const { GET } = await import('../src/pages/rss.xml.js');

const posts = [
	{ id: 'first-post', data: { title: 'First', pubDate: new Date('2024-01-01') } },
	{ id: 'second-post', data: { title: 'Second', pubDate: new Date('2024-02-01') } },
];

describe('rss.xml GET', () => {
	beforeEach(() => {
		getCollection.mockReset();
		rss.mockClear();
		getCollection.mockResolvedValue(posts);
	});

	it('builds the feed from the blog collection', async () => {
		await GET({ site: 'https://example.com' });
		expect(getCollection).toHaveBeenCalledWith('blog');
	});

	it('passes site metadata and context site through to the rss helper', async () => {
		await GET({ site: 'https://example.com' });
		const options = rss.mock.calls[0][0];
		expect(options.title).toBe(SITE_TITLE);
		expect(options.description).toBe(SITE_DESCRIPTION);
		expect(options.site).toBe('https://example.com');
	});

	it('maps each post to an item with a slugged link and its data', async () => {
		await GET({ site: 'https://example.com' });
		const { items } = rss.mock.calls[0][0];
		expect(items).toEqual([
			{ title: 'First', pubDate: posts[0].data.pubDate, link: '/blog/first-post/' },
			{ title: 'Second', pubDate: posts[1].data.pubDate, link: '/blog/second-post/' },
		]);
	});

	it('returns the object produced by the rss helper', async () => {
		const result = await GET({ site: 'https://example.com' });
		expect(result).toEqual({ options: rss.mock.calls[0][0], body: '<rss/>' });
	});

	it('produces an empty item list when there are no posts', async () => {
		getCollection.mockResolvedValue([]);
		await GET({ site: 'https://example.com' });
		expect(rss.mock.calls[0][0].items).toEqual([]);
	});
});
