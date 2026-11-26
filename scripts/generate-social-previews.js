import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

const siteUrl = 'https://www.bkrailway.co.uk';
const siteTitle = "Bo'ness & Kinneil Railway";
const siteDescription = "Discover the Bo'ness and Kinneil Railway. Heritage steam and diesel trains, special events and the Museum of Scottish Railways";
const marker = '<!-- social-preview -->';

const staticPages = {
    timetable: ['Timetable', 'Find train running dates and timetables for your visit.'],
    events: ['Events', 'Discover upcoming events at the railway.'],
    special: ['Something Special', 'Discover special experiences at the railway.'],
    plan: ['Plan Your Visit', 'Plan your visit, including fares and how to get here.'],
    faq: ['FAQs', 'Find answers to frequently asked questions about your visit.'],
};

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]);
}

function renderPreview(template, { title, description, url, image }) {
    const tags = [
        ['property', 'og:type', 'website'],
        ['property', 'og:site_name', siteTitle],
        ['property', 'og:title', title],
        ['property', 'og:description', description],
        ['property', 'og:url', url],
        ['property', 'og:image', image],
        ['property', 'og:image:alt', title],
        ['name', 'twitter:card', 'summary_large_image'],
        ['name', 'twitter:title', title],
        ['name', 'twitter:description', description],
        ['name', 'twitter:image', image],
    ].map(([attribute, name, content]) =>
        `    <meta ${attribute}="${name}" content="${escapeHtml(content)}">`
    ).join('\n');

    return template.replace(marker, tags);
}

async function getItems(endpoint, collection, fields, fetchImpl) {
    const url = new URL(`/items/${collection}`, endpoint);
    url.searchParams.set('fields', fields);
    url.searchParams.set('filter', JSON.stringify({ status: { _eq: 'published' } }));
    url.searchParams.set('limit', '-1');
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`CMS ${collection} request failed: ${response.status}`);
    const result = await response.json();
    if (!Array.isArray(result.data)) throw new Error(`Invalid CMS ${collection} response`);
    return result.data;
}

export async function generateSocialPreviews({ distDir, cmsEndpoint, defaultImagePath, fetchImpl = fetch }) {
    const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
    if (!template.includes(marker)) throw new Error('Social preview marker is missing from index.html');
    if (!cmsEndpoint) throw new Error('VITE_CMS_ENDPOINT is required to generate social previews');

    const [pages, events, specials] = await Promise.all([
        getItems(cmsEndpoint, 'Page', 'slug,Title,carousel_items.image', fetchImpl),
        getItems(cmsEndpoint, 'Events', 'Page,Image', fetchImpl),
        getItems(cmsEndpoint, 'Specials', 'Page,Image', fetchImpl),
    ]);

    const linkedImages = new Map();
    for (const item of [...events, ...specials]) {
        if (typeof item.Page === 'string' && typeof item.Image === 'string') {
            const match = item.Page.match(/^\/?page\/([A-Za-z0-9_-]+)\/?$/);
            if (match && !linkedImages.has(match[1])) linkedImages.set(match[1], item.Image);
        }
    }

    const defaultImage = `${siteUrl}/social-preview.jpg`;
    const previews = new Map([
        ['', { title: siteTitle, description: siteDescription, image: defaultImage }],
        ...Object.entries(staticPages).map(([route, [title, description]]) => [
            route, { title: `${title} | ${siteTitle}`, description, image: defaultImage },
        ]),
    ]);

    for (const page of pages) {
        if (typeof page.slug !== 'string' || !/^[A-Za-z0-9_-]+$/.test(page.slug) ||
            typeof page.Title !== 'string' || !page.Title.trim() || !Array.isArray(page.carousel_items)) {
            throw new Error('Invalid published CMS page: expected a valid slug, title and carousel items');
        }
        const route = `page/${page.slug}`;
        if (previews.has(route)) throw new Error(`Duplicate published page slug: ${page.slug}`);
        const imageId = page.carousel_items.find(item => typeof item.image === 'string' && item.image)?.image ||
            linkedImages.get(page.slug);
        previews.set(route, {
            title: `${page.Title} | ${siteTitle}`,
            description: `Find out more about ${page.Title} at the ${siteTitle}.`,
            image: imageId ? new URL(`/assets/${encodeURIComponent(imageId)}`, cmsEndpoint).href : defaultImage,
        });
    }
    if (previews.has('page/birkhill')) previews.set('birkhill', previews.get('page/birkhill'));

    await copyFile(defaultImagePath, path.join(distDir, 'social-preview.jpg'));
    for (const [route, preview] of previews) {
        const filename = route ? `${route}.html` : 'index.html';
        const outputPath = path.join(distDir, filename);
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, renderPreview(template, {
            ...preview,
            url: `${siteUrl}/${route}`,
        }));
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
    const env = loadEnv(process.env.NODE_ENV || 'production', root, 'VITE_');
    await generateSocialPreviews({
        distDir: path.join(root, 'dist'),
        cmsEndpoint: env.VITE_CMS_ENDPOINT,
        defaultImagePath: path.join(root, 'src/assets/PlanBanner.jpg'),
    });
}
