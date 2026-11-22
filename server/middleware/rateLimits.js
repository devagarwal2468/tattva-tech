import rateLimit from 'express-rate-limit';

const num = (name, fallback) => {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const make = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message },
  });

// Limits are overridable via env so tests (and ops) can tune them.
export const contactLimiter = make(
  num('RATE_LIMIT_CONTACT_WINDOW_MS', 10 * 60 * 1000),
  num('RATE_LIMIT_CONTACT_MAX', 5),
  'Too many enquiries from this network. Please try again in a few minutes.'
);

export const authLimiter = make(
  num('RATE_LIMIT_AUTH_WINDOW_MS', 15 * 60 * 1000),
  num('RATE_LIMIT_AUTH_MAX', 10),
  'Too many sign-in attempts. Please wait 15 minutes and try again.'
);

export const applicationLimiter = make(
  num('RATE_LIMIT_APPLICATION_WINDOW_MS', 60 * 60 * 1000),
  num('RATE_LIMIT_APPLICATION_MAX', 5),
  'Too many applications from this network. Please try again later.'
);
