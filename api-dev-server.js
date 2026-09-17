import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// ---- Auth Route ----
app.all('/api/auth', async (req, res) => {
  try {
    const handler = (await import('./api/auth.js')).default;
    return handler(req, res);
  } catch (err) {
    console.error('[API] /api/auth error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---- User Portal Route ----
app.all('/api/user-portal', async (req, res) => {
  try {
    const handler = (await import('./api/user-portal.js')).default;
    return handler(req, res);
  } catch (err) {
    console.error('[API] /api/user-portal error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---- Wix Checkout Route ----
app.all('/api/wix-checkout', async (req, res) => {
  try {
    const handler = (await import('./api/wix-checkout.js')).default;
    return handler(req, res);
  } catch (err) {
    console.error('[API] /api/wix-checkout error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ---- Dynamic fallback for /api/:route ----
app.all('/api/:route', async (req, res) => {
  const route = req.params.route;
  try {
    const mod = await import(`./api/${route}.js`);
    if (mod && mod.default) {
      return mod.default(req, res);
    }
    return res.status(404).json({ error: `Handler not found for /api/${route}` });
  } catch (err) {
    console.error(`[API] /api/${route} error:`, err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[API] Buena Toma Dev Server running on http://localhost:${PORT}`);
  console.log(`[API] Wix Site ID: ${process.env.VITE_WIX_SITE_ID?.substring(0, 8)}...`);
});
