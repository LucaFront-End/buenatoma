const fetch = globalThis.fetch;
const { createClient, OAuthStrategy } = require('@wix/sdk');
const { items } = require('@wix/data');

const BASE_URL = 'http://localhost:3001';
const VITE_URL = 'http://localhost:5173';
const WIX_CLIENT_ID = 'eff755df-8862-4387-a536-243c5b941a4f';

async function runBackendE2E() {
  console.log('====================================================');
  console.log('🚀 INICIANDO TEST E2E LADO BACKEND & WIX CMS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, extraInfo = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName} ${extraInfo ? `— ${extraInfo}` : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${extraInfo ? `— ${extraInfo}` : ''}`);
      failed++;
    }
  }

  // TEST 1: Register a new user in /api/auth
  const testEmail = `test.e2e.${Date.now()}@buenatoma.mx`;
  console.log('--- TEST 1: Registro de Nuevo Usuario (/api/auth) ---');
  try {
    const regRes = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        name: 'Camila & Mateo Test',
        email: testEmail,
        password: 'securePassword2026',
        phone: '55 9876 5432',
        city: 'CDMX',
        role: 'client',
        sessionCode: 'BNTM-26002',
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.success === true, 'Registro de nuevo usuario con hash scrypt', `Email: ${testEmail}`);
  } catch (err) {
    assert(false, 'Registro de nuevo usuario', err.message);
  }

  // TEST 2: Login with the registered user
  console.log('\n--- TEST 2: Login con Contraseña Cifrada (/api/auth) ---');
  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email: testEmail,
        password: 'securePassword2026',
      }),
    });
    const loginData = await loginRes.json();
    assert(
      loginRes.status === 200 && loginData.success === true && loginData.user?.email === testEmail,
      'Login exitoso con contraseña correcta',
      `Nombre: ${loginData.user?.name}`
    );

    // Test bad password rejection
    const badLoginRes = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email: testEmail,
        password: 'wrongPassword123',
      }),
    });
    assert(badLoginRes.status === 401, 'Rechazo de login con contraseña incorrecta (HTTP 401)');
  } catch (err) {
    assert(false, 'Login con contraseña', err.message);
  }

  // TEST 3: Filmmaker Tag Login
  console.log('\n--- TEST 3: Login de Staff Filmmaker (/api/auth) ---');
  try {
    const filmRes = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email: 'isaac@buenatoma.mx',
        password: 'password123',
      }),
    });
    const filmData = await filmRes.json();
    const hasFilmTag = filmData.user?.tags?.includes('Filmmaker');
    assert(
      filmRes.status === 200 && filmData.user?.role === 'filmmaker' && hasFilmTag,
      'Identificación de rol Filmmaker y etiqueta Staff',
      `Tags: ${filmData.user?.tags?.join(', ')}`
    );
  } catch (err) {
    assert(false, 'Login de Staff Filmmaker', err.message);
  }

  // TEST 4: User Portal Data Consolidation
  console.log('\n--- TEST 4: Consolidación de Portal de Usuario (/api/user-portal) ---');
  try {
    const portalRes = await fetch(`${BASE_URL}/api/user-portal?email=${testEmail}&sessionCode=BNTM-26002`);
    const portalData = await portalRes.json();
    assert(
      portalRes.status === 200 && portalData.success === true && portalData.user?.sessionCode === 'BNTM-26002',
      'Consulta unificada de portal para el usuario',
      `Sesiones vinculadas: ${portalData.sessions?.length}`
    );
  } catch (err) {
    assert(false, 'Consulta de portal de usuario', err.message);
  }

  // TEST 5: Wix Checkout Engine for Photos Extras
  console.log('\n--- TEST 5: Motor de Wix Checkout (/api/wix-checkout) ---');
  try {
    const checkoutRes = await fetch(`${BASE_URL}/api/wix-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Camila Test',
        correo: testEmail,
        telefono: '55 9876 5432',
        sessionCode: 'BNTM-26002',
        tipoPago: 'fotos_extras',
        cantidadExtras: 5,
        incluyeCuadro: true,
        tamanoCuadro: '20x30" Fine Art',
        marcoCuadro: 'Madera Nogal Sólida',
        montoACobrar: 3100, // 5 * 250 + 1850 = 3100
      }),
    });
    const chkData = await checkoutRes.json();
    const hasUrl = Boolean(chkData.checkoutUrl && chkData.checkoutUrl.includes('checkout'));
    assert(
      checkoutRes.status === 200 && chkData.success === true && hasUrl,
      'Generación de sesión y URL de Checkout oficial Wix',
      `Orden: ${chkData.orderCode} | Total: $${chkData.montoCobrado} MXN`
    );
  } catch (err) {
    assert(false, 'Motor de Wix Checkout', err.message);
  }

  // TEST 6: Vite Dev Server Proxy to /api
  console.log('\n--- TEST 6: Proxy de Vite /api en http://localhost:5173 ---');
  try {
    const proxyRes = await fetch(`${VITE_URL}/api/user-portal?email=sofia.oramas@gmail.com&sessionCode=BNTM-26001`);
    const proxyData = await proxyRes.json();
    assert(
      proxyRes.status === 200 && proxyData.success === true,
      'Vite dev proxy transparent forwarding a Express (puerto 3001)',
      `User: ${proxyData.user?.name}`
    );
  } catch (err) {
    assert(false, 'Proxy de Vite /api', err.message);
  }

  // TEST 7: Direct Wix CMS SDK Query
  console.log('\n--- TEST 7: Conexión SDK Wix CMS en Vivo (Galeria) ---');
  try {
    const wixClient = createClient({
      modules: { items },
      auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
    });
    const tokens = await wixClient.auth.generateVisitorTokens();
    await wixClient.auth.setTokens(tokens);

    const galeriaQuery = await wixClient.items.query('Galeria').limit(5).find();
    assert(
      Array.isArray(galeriaQuery.items),
      'Conexión activa con Wix CMS colección "Galeria"',
      `Total items disponibles: ${galeriaQuery.items.length}`
    );
  } catch (err) {
    assert(false, 'Conexión SDK Wix CMS', err.message);
  }

  console.log('\n====================================================');
  console.log(`📊 RESULTADOS DEL AUDIT BACKEND: ${passed} PASADOS | ${failed} FALLIDOS`);
  console.log('====================================================\n');

  if (failed > 0) process.exit(1);
}

runBackendE2E();
