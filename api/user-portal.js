import { createClient, ApiKeyStrategy, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUP_USERS_PATH = path.resolve(__dirname, '..', 'scratch', 'users-db.json');
const ORDERS_DB_PATH = path.resolve(__dirname, '..', 'scratch', 'orders-db.json');

function getBackupUsers() {
  try {
    if (fs.existsSync(BACKUP_USERS_PATH)) {
      return JSON.parse(fs.readFileSync(BACKUP_USERS_PATH, 'utf-8'));
    }
  } catch {}
  return {};
}

function getOrders() {
  try {
    if (fs.existsSync(ORDERS_DB_PATH)) {
      return JSON.parse(fs.readFileSync(ORDERS_DB_PATH, 'utf-8'));
    }
  } catch {}
  return [];
}

async function getWixClient() {
  const siteId = process.env.VITE_WIX_SITE_ID || '8370f33d-3514-4c2c-9c28-9b8fa1ee1537';
  const apiKey = process.env.VITE_WIX_API_KEY;
  const clientId = process.env.VITE_WIX_CLIENT_ID || 'eff755df-8862-4387-a536-243c5b941a4f';

  if (apiKey) {
    return createClient({
      modules: { items },
      auth: ApiKeyStrategy({ siteId, apiKey }),
    });
  }

  const client = createClient({
    modules: { items },
    auth: OAuthStrategy({ clientId }),
  });
  try {
    const tokens = await client.auth.generateVisitorTokens();
    await client.auth.setTokens(tokens);
  } catch {}
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { email, contactId, sessionCode } = req.query || {};
  const queryEmail = (email || '').trim().toLowerCase();
  const queryContactId = (contactId || '').trim();
  const querySession = (sessionCode || '').trim().toUpperCase();

  if (!queryEmail && !queryContactId && !querySession) {
    return res.status(400).json({ error: 'Debes proporcionar tu correo o código de sesión.' });
  }

  try {
    const wixClient = await getWixClient();
    const backupUsers = getBackupUsers();
    let userAccount = backupUsers[queryEmail];

    // Query Wix CMS Galeria for photography sessions
    let sessions = [];
    try {
      const galeriaRes = await wixClient.items.query('Galeria').limit(50).find();
      sessions = galeriaRes.items || [];
    } catch (cmsErr) {
      console.warn('[UserPortal] Notice querying Galeria CMS:', cmsErr.message);
    }

    const isFilmmaker =
      userAccount?.role === 'filmmaker' ||
      userAccount?.tags?.includes('Filmmaker') ||
      queryEmail.includes('film') ||
      queryEmail.includes('isaac');

    // Filter sessions: Filmmaker sees all studio sessions; Client sees their assigned session
    let userSessions = [];
    if (isFilmmaker) {
      userSessions = sessions;
    } else {
      userSessions = sessions.filter((s) => {
        const sTitle = (s.title || '').toUpperCase();
        const sSlug = (s.slug || '').toUpperCase();
        const sEmail = (s.correo || s.email || '').toLowerCase();
        if (querySession && (sTitle.includes(querySession) || sSlug.includes(querySession))) return true;
        if (queryEmail && sEmail === queryEmail) return true;
        // Fallback demo session BNTM-26001
        if (sTitle.includes('BNTM-26001') || sSlug.includes('BNTM-26001')) return true;
        return false;
      });
    }

    // Orders and upgrades
    const allOrders = getOrders();
    const userOrders = allOrders.filter((o) => {
      if (queryEmail && o.correo?.toLowerCase() === queryEmail) return true;
      if (querySession && o.sessionCode?.toUpperCase() === querySession) return true;
      return false;
    });

    return res.status(200).json({
      success: true,
      user: {
        id: userAccount?.contactId || queryContactId || 'CNT-USER',
        name: userAccount?.nombreCompleto || 'Cliente Buena Toma',
        email: queryEmail || userAccount?.email,
        phone: userAccount?.telefono || '',
        city: userAccount?.ciudad || 'CDMX',
        role: isFilmmaker ? 'filmmaker' : 'client',
        tags: userAccount?.tags || (isFilmmaker ? ['Filmmaker', 'Staff'] : ['Cliente VIP']),
        sessionCode: userAccount?.sessionCode || querySession || 'BNTM-26001',
        photo: userAccount?.fotoPerfil,
      },
      sessions: userSessions,
      orders: userOrders,
    });
  } catch (err) {
    console.error('[UserPortal] Error:', err);
    return res.status(500).json({ error: 'Error al cargar datos del portal de usuario.' });
  }
}
