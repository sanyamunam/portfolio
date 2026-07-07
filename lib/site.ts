/* The site now lives at the domain root (sanyamunam.com), so raw asset
   URLs need no prefix. withBase stays as the single indirection point
   in case the serving path ever changes again. */
export const SITE_URL = 'https://sanyamunam.com';

export const BASE = '';

export const withBase = (path: string) => `${BASE}${path}`;
