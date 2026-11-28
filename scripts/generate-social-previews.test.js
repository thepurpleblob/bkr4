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
        assert.equal(url.searchParams.get('deep[carousel_items][_sort]'), url.pathname.endsWith('/Page') ? 'sort,id' : null);
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

test('uses optional page social fields and falls back independently when blank or absent', async t => {
    const options = await fixture(t);
    const pages = [
        {
            slug: 'custom', Title: 'Page title', carousel_items: [{ image: 'carousel' }],
            og_title: '  A & B  ', og_description: '  Special "description"  ', og_image: 'custom-image',
        },
        {
            slug: 'fallback', Title: 'Fallback', carousel_items: [{ image: 'carousel' }],
            og_title: '  ', og_description: null, og_image: '',
        },
    ];
    const fetchImpl = async url => {
        if (url.pathname.endsWith('/Page')) {
            assert.equal(url.searchParams.get('fields'), '*,carousel_items.image');
        }
        return { ok: true, json: async () => ({ data: url.pathname.endsWith('/Page') ? pages : [] }) };
    };

    await generateSocialPreviews({ ...options, fetchImpl });
    const custom = await readFile(path.join(options.distDir, 'page/custom.html'), 'utf8');
    const fallback = await readFile(path.join(options.distDir, 'page/fallback.html'), 'utf8');
    assert.match(custom, /og:title" content="A &amp; B"/);
    assert.match(custom, /twitter:title" content="A &amp; B"/);
    assert.match(custom, /og:description" content="Special &quot;description&quot;"/);
    assert.match(custom, /twitter:description" content="Special &quot;description&quot;"/);
    assert.match(custom, /og:image" content="https:\/\/cms\.example\.com\/assets\/custom-image"/);
    assert.match(custom, /twitter:image" content="https:\/\/cms\.example\.com\/assets\/custom-image"/);
    assert.match(fallback, /og:title" content="Fallback \| Bo&#39;ness &amp; Kinneil Railway"/);
    assert.match(fallback, /og:description" content="Find out more about Fallback at the Bo&#39;ness &amp; Kinneil Railway\."/);
    assert.match(fallback, /og:image" content="https:\/\/cms\.example\.com\/assets\/carousel"/);
});

test('rejects invalid page social field values', async t => {
    const options = await fixture(t);
    const fetchImpl = async url => ({
        ok: true,
        json: async () => ({
            data: url.pathname.endsWith('/Page')
                ? [{ slug: 'invalid', Title: 'Invalid', carousel_items: [], og_image: {} }]
                : [],
        }),
    });
    await assert.rejects(generateSocialPreviews({ ...options, fetchImpl }), /Invalid og_image for published page: invalid/);
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
