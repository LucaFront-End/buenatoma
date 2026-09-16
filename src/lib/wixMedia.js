/**
 * Utility for converting Wix Media URIs (wix:image://... / wix:video://...)
 * into accessible HTTPS CDN URLs.
 */

export function getWixImageUrl(src) {
  if (!src) return '';

  // Already a full HTTP/HTTPS URL (e.g. Unsplash or direct Pixieset link)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Wix Image format: wix:image://v1/{mediaId}/{filename}#originWidth=...
  if (src.startsWith('wix:image://v1/')) {
    const withoutPrefix = src.replace('wix:image://v1/', '');
    const parts = withoutPrefix.split('/');
    const mediaId = parts[0];
    if (mediaId) {
      return `https://static.wixstatic.com/media/${mediaId}`;
    }
  }

  // Fallback if just a media slug or filename
  if (src.includes('~mv2')) {
    return `https://static.wixstatic.com/media/${src}`;
  }

  return src;
}

/**
 * Formats Wix image object or URL into a standardized gallery item
 */
export function normalizeGalleryItem(rawItem, index = 0) {
  if (!rawItem) return null;

  // If already standard format string
  if (typeof rawItem === 'string') {
    const url = getWixImageUrl(rawItem);
    return {
      id: `IMG-${index + 1}`,
      title: `Foto #${index + 1}`,
      url,
      thumb: url,
      rawSrc: rawItem,
      fileName: `Foto-${index + 1}.jpg`
    };
  }

  const src = rawItem.src || rawItem.slug || rawItem.url || '';
  const url = getWixImageUrl(src);
  const fileName = rawItem.fileName || rawItem.title || `Foto-${index + 1}.jpg`;

  return {
    id: rawItem.id || rawItem.slug || rawItem._id || `IMG-${index + 1}`,
    title: rawItem.title || fileName.replace(/\.[^/.]+$/, ''),
    fileName: fileName,
    url: url,
    thumb: url,
    rawSrc: rawItem.src || rawItem.slug || '',
    aspect: (rawItem.settings?.height > rawItem.settings?.width) ? 'portrait' : 'landscape',
    focal: rawItem.description || rawItem.alt || 'Buena Toma Studio',
    originalItem: rawItem
  };
}
