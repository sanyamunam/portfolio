/* Raw <img>/<video>/CSS asset URLs don't get Next's basePath automatically —
   route them through withBase() so they resolve under /portfolio on Pages. */
export const BASE = process.env.NODE_ENV === 'production' ? '/portfolio' : '';

export const withBase = (path: string) => `${BASE}${path}`;
