import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { generateSocialPreviews } from './generate-social-previews.js';

async function fixture(t) {
    const root = await mkdtemp(path.join(os.tmpdir(), 'bkr-previews-'));
    t.after(() => rm(root, { recursive: true, force: true }));
    const distDir = path.join(root, 'dist');
    await mkdir(distDir);
    await writeFile(path.join(distDir, 'index.html'), '<head><!-- social-preview --></head><script src="/app.js"></script>');
    const defaultImagePath = path.join(root, 'image.jpg');
    await writeFile(defaultImagePath, 'image');
    return { distDir, defaultImagePath, cmsEndpoint: 'https://cms.example.com' };
}

test('generates distinct crawler-visible previews and chooses page images', async t => {
    const options = await fixture(t);
    const responses = {
        Page: [
            { slug: 'santa', Title: 'Santa & Steam', carousel_items: [{ image: 'carousel-image' }] },
            { slug: 'tea', Title: 'Afternoon Tea', carousel_items: [] },
            { slug: 'terms', Title: 'Terms', carousel_items: [] },
        ],
        Events: [{ Page: 'page/tea', Image: 'event-image' }, { Page: '/page/santa', Image: 'other-image' }],
        Specials: [],
    };
    const fetchImpl = async url => {
        assert.deepEqual(JSON.parse(url.searchParams.get('filter')), { status: { _eq: 'published' } });
        assert.equal(url.searchParams.get('limit'), '-1');
        return { ok: true, json: async () => ({ data: responses[url.pathname.split('/').pop()] }) };
    };

    await generateSocialPreviews({ ...options, fetchImpl });
    const santa = await readFile(path.join(options.distDir, 'page/santa.html'), 'utf8');
    const tea = await readFile(path.join(options.distDir, 'page/tea.html'), 'utf8');
    const terms = await readFile(path.join(options.distDir, 'page/terms.html'), 'utf8');
    const homepage = await readFile(path.join(options.distDir, 'index.html'), 'utf8');
    const timetable = await readFile(path.join(options.distDir, 'timetable.html'), 'utf8');
    assert.match(santa, /og:title" content="Santa &amp; Steam \| Bo&#39;ness &amp; Kinneil Railway"/);
    assert.match(santa, /og:url" content="https:\/\/www\.bkrailway\.co\.uk\/page\/santa"/);
    assert.match(santa, /og:image" content="https:\/\/cms\.example\.com\/assets\/carousel-image"/);
    assert.match(tea, /og:image" content="https:\/\/cms\.example\.com\/assets\/event-image"/);
    assert.match(terms, /og:image" content="https:\/\/www\.bkrailway\.co\.uk\/social-preview\.jpg"/);
    assert.match(homepage, /og:url" content="https:\/\/www\.bkrailway\.co\.uk\/"/);
    assert.match(timetable, /og:title" content="Timetable \|/);
    assert.match(santa, /<script src="\/app\.js"><\/script>/);
    assert.equal(await readFile(path.join(options.distDir, 'social-preview.jpg'), 'utf8'), 'image');
});

test('fails the build when the CMS cannot provide published pages', async t => {
    const options = await fixture(t);
    await assert.rejects(
        generateSocialPreviews({ ...options, fetchImpl: async () => ({ ok: false, status: 503 }) }),
        /CMS .* request failed: 503/,
    );
});

test('rejects unsafe page slugs rather than writing outside the preview directory', async t => {
    const options = await fixture(t);
    const fetchImpl = async url => ({
        ok: true,
        json: async () => ({
            data: url.pathname.endsWith('/Page')
                ? [{ slug: '../outside', Title: 'Invalid', carousel_items: [] }]
                : [],
        }),
    });
    await assert.rejects(generateSocialPreviews({ ...options, fetchImpl }), /Invalid published CMS page/);
});
