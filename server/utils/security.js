// Shared security helpers.

const DEV_JWT_FALLBACK = 'tattva-tech-dev-only-jwt-secret-do-not-use-in-production';

export const isProduction = () =>
  process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

export class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
    this.statusCode = 500;
  }
}

/**
 * Returns the JWT signing secret. In production a missing JWT_SECRET is a hard
 * configuration error — we never fall back to a secret that is public on GitHub.
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.trim()) return secret;
  if (isProduction()) {
    console.error('[Config Error]: JWT_SECRET is not set. Admin authentication is disabled until it is configured.');
    throw new ConfigError('Server auth not configured');
  }
  return DEV_JWT_FALLBACK;
};

/** Escape a user string so it can be used literally inside a RegExp. */
export const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Build a safe case-insensitive search RegExp (or null if empty). */
export const buildSearchRegex = (search) => {
  if (typeof search !== 'string') return null;
  const trimmed = search.trim().slice(0, 100);
  if (!trimmed) return null;
  return new RegExp(escapeRegex(trimmed), 'i');
};

/** HTML-escape a value for safe interpolation into email templates. */
export const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const isHttpUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Pragmatic email check: local@domain.tld, allows plus-addressing, subdomains, long TLDs.
export const EMAIL_REGEX = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,24}$/;

export const isValidEmail = (value) =>
  typeof value === 'string' && value.length <= 254 && EMAIL_REGEX.test(value.trim());
