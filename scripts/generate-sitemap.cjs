/**
 * Dynamic Sitemap Generator for Buena Toma
 * 
 * Generates:
 *  - sitemap.xml           → Master index referencing all sub-sitemaps
 *  - sitemap-pages.xml     → General static pages based on SEO BUENA TOMA.pdf
 *  - sitemap-landings.xml  → All 100% dynamic CMS landing pages fetched from Wix CMS
 * 
 * Usage: node scripts/generate-sitemap.cjs
 */

const { createClient, OAuthStrategy } = require('@wix/sdk');
const { items } = require('@wix/data');
const fs = require('fs');
const path = require('path');

// ─── Configuration ─────────────────────────────────────────────────────────────
const SITE_URL = 'https://buenatoma.mx';
const WIX_CLIENT_ID = 'eff755df-8862-4387-a536-243c5b941a4f';
const COLLECTION_ID = 'LandingDinamicas';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'public');

// ─── Helpers ───────────────────────────────────────────────────────────────────
function today() {
  return new Date().toISOString().split('T')[0];
}

function xmlEscape(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildUrlEntry(loc, lastmod, changefreq = 'weekly', priority = '0.7') {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// ─── Create Wix Client ─────────────────────────────────────────────────────────
async function createWixClient() {
  const wixClient = createClient({
    modules: { items },
    auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
  });
  try {
    const tokens = await wixClient.auth.generateVisitorTokens();
    await wixClient.auth.setTokens(tokens);
  } catch (err) {
    console.warn('[Sitemap] Warning generating visitor tokens:', err?.message || err);
  }
  return wixClient;
}

// ─── 1. General Pages (from SEO BUENA TOMA.pdf) ────────────────────────────────
function generatePagesSitemap() {
  const pages = [
    { path: '/',                   changefreq: 'daily',   priority: '1.0' }, // Home
    { path: '/servicios',          changefreq: 'weekly',  priority: '0.9' }, // Catálogo de Servicios
    { path: '/cotizador',          changefreq: 'weekly',  priority: '0.9' }, // Cotizador interactivo
    { path: '/portafolio',         changefreq: 'weekly',  priority: '0.9' }, // Portafolio
    { path: '/paquetes',           changefreq: 'weekly',  priority: '0.9' }, // Alias paquetes
    { path: '/comunidad',          changefreq: 'weekly',  priority: '0.8' }, // Comunidad
    { path: '/contacto',           changefreq: 'monthly', priority: '0.8' }, // Contacto
    { path: '/zonas',              changefreq: 'daily',   priority: '0.8' }, // Zonas Hub
    { path: '/pedidademano',       changefreq: 'weekly',  priority: '0.85' }, // Galería Pixieset Pedida de Mano
    { path: '/seleccion',          changefreq: 'weekly',  priority: '0.85' }, // Etapa 1: Selección de fotos
    { path: '/entrega',            changefreq: 'weekly',  priority: '0.85' }, // Etapa 2: Entrega final (Ya quedaron)
    { path: '/servicio-cumple',    changefreq: 'weekly',  priority: '0.8' }, // Paquetes Cumpleaños
    { path: '/servicio-parejas',   changefreq: 'weekly',  priority: '0.8' }, // Parejas
    { path: '/servicio-casual',    changefreq: 'weekly',  priority: '0.8' }, // Sesiones Casuales
    { path: '/servicio-maternidad', changefreq: 'weekly', priority: '0.8' }, // Maternidad
    { path: '/servicio-xv',        changefreq: 'weekly',  priority: '0.8' }, // XV Años
    { path: '/servicio-graduacion', changefreq: 'weekly', priority: '0.8' }, // Graduación
  ];

  const entries = pages
    .map((p) => buildUrlEntry(`${SITE_URL}${p.path}`, today(), p.changefreq, p.priority))
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

// ─── 2. Dynamic Landing Pages (from Wix CMS LandingDinamicas) ─────────────────
async function generateLandingsSitemap(wixClient) {
  console.log(`📍 Consultando TODAS las landings dinámicas en colección "${COLLECTION_ID}"...`);
  try {
    const allItems = [];
    let pageNum = 1;

    let page = await wixClient.items
      .query(COLLECTION_ID)
      .limit(1000)
      .find();

    allItems.push(...(page.items || []));
    process.stdout.write(`   Descargando página ${pageNum} (${allItems.length} landings)... `);

    while (page.hasNext()) {
      pageNum++;
      page = await page.next();
      allItems.push(...(page.items || []));
      process.stdout.write(`pág ${pageNum} (${allItems.length})... `);
    }

    console.log(`\n✅ Total de landings descargadas del CMS: ${allItems.length}`);

    // Deduplicate by slug to ensure 100% valid unique sitemap URLs
    const seenSlugs = new Set();
    const entries = [];

    for (const item of allItems) {
      const data = item.data || item;
      const rawSlug = (data.slug || '').trim().replace(/^\/+/, '');
      if (!rawSlug || seenSlugs.has(rawSlug)) continue;
      seenSlugs.add(rawSlug);

      const lastmod = data._updatedDate
        ? new Date(data._updatedDate).toISOString().split('T')[0]
        : today();

      entries.push(buildUrlEntry(`${SITE_URL}/${rawSlug}`, lastmod, 'weekly', '0.7'));
    }

    console.log(`   Se generaron ${entries.length} URLs únicas para sitemap-landings.xml.`);

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
  } catch (err) {
    console.error('❌ Error consultando landings de Wix CMS:', err?.message || err);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
  }
}

// ─── 3. Sitemap Index ──────────────────────────────────────────────────────────
function generateSitemapIndex() {
  const subSitemaps = [
    'sitemap-pages.xml',
    'sitemap-landings.xml',
  ];

  const entries = subSitemaps
    .map((name) => `  <sitemap>
    <loc>${SITE_URL}/${name}</loc>
    <lastmod>${today()}</lastmod>
  </sitemap>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

// ─── Main Execution ───────────────────────────────────────────────────────────
async function main() {
  console.log('🗺️  Generando sitemaps dinámicos de Buena Toma...\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 1. Static Pages
  const pagesSitemap = generatePagesSitemap();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-pages.xml'), pagesSitemap, 'utf-8');
  console.log('✅ sitemap-pages.xml generado.');

  // 2. Dynamic Landings
  const wixClient = await createWixClient();
  const landingsSitemap = await generateLandingsSitemap(wixClient);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-landings.xml'), landingsSitemap, 'utf-8');
  console.log('✅ sitemap-landings.xml generado.');

  // 3. Sitemap Index
  const sitemapIndex = generateSitemapIndex();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemapIndex, 'utf-8');
  console.log('✅ sitemap.xml (índice maestro) generado.\n');

  console.log('🎉 Todos los sitemaps fueron generados exitosamente en /public/');
}

main().catch((err) => {
  console.error('❌ Falló la generación del sitemap:', err);
  process.exit(1);
});
