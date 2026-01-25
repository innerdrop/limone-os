/**
 * Helper to generate optimized Cloudinary URLs in the browser or server.
 * This file does NOT import the 'cloudinary' SDK to avoid 'fs' errors in the browser.
 */
export const getOptimizedUrl = (url: string | null | undefined, width?: number, height?: number) => {
    if (!url || !url.includes('cloudinary.com')) return url || '';

    // Inserta transformaciones de calidad y formato automático
    // f_auto: formato automático (webp/avif)
    // q_auto: calidad automática inteligente
    let transformations = 'f_auto,q_auto';

    if (width && height) {
        transformations += `,c_fill,g_auto,w_${width},h_${height}`;
    } else if (width) {
        transformations += `,w_${width},c_limit`;
    }

    // Handle both /upload/ and /upload/v12345/ formats
    if (url.includes('/upload/')) {
        return url.replace('/upload/', `/upload/${transformations}/`);
    }

    return url;
};
