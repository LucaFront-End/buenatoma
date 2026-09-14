import { useState, useEffect } from 'react';
import { useWixClient } from '../context/WixContext';
import { LANDINGS_COLLECTION } from '../lib/wixClient';

// ── Normalizer for LandingDinamicas CMS items ──────────────────────────────
export function normalizeCMSItem(item) {
  if (!item) return null;
  const data = item.data || item;
  return {
    _id: data._id,
    slug: data.slug || '',
    titulo: data.titulo || '',
    tituloPagina: data.tituloPagina || data.titulo || '',
    excerptPagina: data.excerptPagina || '',
    fraseAUtilizar: data.fraseAUtilizar || '',
    ciudadYEstado: data.ciudadYEstado || '',
    estado: data.estado || '',
    tituloSeo: data.tituloSeo || data.tituloPagina || data.titulo || 'Buena Toma | Estudio de Fotografía Profesional en Ciudad de México',
    metadescripcionSeo: data.metadescripcionSeo || data.excerptPagina || '',
    whatsapp: data.whatsapp || '',
    publishStatus: data._publishStatus || 'PUBLISHED',
    createdDate: data._createdDate || '',
    updatedDate: data._updatedDate || '',
  };
}

// ── Hook: Fetch all published dynamic landings ─────────────────────────────
export function useWixLandings() {
  const { wixClient, isReady } = useWixClient();
  const [landings, setLandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);
      try {
        const res = await wixClient.items
          .query(LANDINGS_COLLECTION)
          .limit(100)
          .find();
        
        if (!cancelled) {
          const items = (res.items || [])
            .map(normalizeCMSItem)
            .filter(item => item && item.publishStatus === 'PUBLISHED');
          setLandings(items);
        }
      } catch (err) {
        console.error('[CMS] Error fetching landings:', err);
        if (!cancelled) setError(err?.message || 'No se pudieron cargar las landings.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [wixClient, isReady]);

  return { landings, loading, error };
}

// ── Hook: Fetch single landing by slug ──────────────────────────────────────
export function useWixLandingBySlug(slug) {
  const { wixClient, isReady } = useWixClient();
  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isReady || !slug) return;
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      setError(null);
      try {
        // Query by exact slug
        const res = await wixClient.items
          .query(LANDINGS_COLLECTION)
          .eq('slug', slug)
          .limit(1)
          .find();

        if (!cancelled) {
          if (res.items && res.items.length > 0) {
            setLanding(normalizeCMSItem(res.items[0]));
          } else {
            // Fallback: search across all items in case slug formatting differed
            const allRes = await wixClient.items
              .query(LANDINGS_COLLECTION)
              .limit(100)
              .find();
            
            const match = (allRes.items || []).find(i => {
              const d = i.data || i;
              return d.slug?.toLowerCase() === slug.toLowerCase();
            });

            if (match) {
              setLanding(normalizeCMSItem(match));
            } else {
              setLanding(null);
              setError('Landing no encontrada');
            }
          }
        }
      } catch (err) {
        console.error(`[CMS] Error fetching landing "${slug}":`, err);
        if (!cancelled) {
          setError(err?.message || 'Error al obtener los datos del CMS.');
          setLanding(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [wixClient, isReady, slug]);

  return { landing, loading, error };
}
