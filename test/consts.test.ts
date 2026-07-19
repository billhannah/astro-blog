import { describe, expect, it } from 'vitest';
import * as consts from '../src/consts';
import { SITE_DESCRIPTION, SITE_TITLE } from '../src/consts';

describe('consts', () => {
	it('exports a non-empty SITE_TITLE string', () => {
		expect(typeof SITE_TITLE).toBe('string');
		expect(SITE_TITLE.length).toBeGreaterThan(0);
		expect(SITE_TITLE).toBe('Astro Blog');
	});

	it('exports a non-empty SITE_DESCRIPTION string', () => {
		expect(typeof SITE_DESCRIPTION).toBe('string');
		expect(SITE_DESCRIPTION.length).toBeGreaterThan(0);
		expect(SITE_DESCRIPTION).toBe('Welcome to my website!');
	});

	it('only exports the expected public constants', () => {
		expect(Object.keys(consts).sort()).toEqual([
			'SITE_DESCRIPTION',
			'SITE_TITLE',
		]);
	});
});
