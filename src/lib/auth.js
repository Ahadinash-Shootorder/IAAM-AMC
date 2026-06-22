import { TextEncoder } from 'util';

/**
 * Returns the JWT signing/verification secret derived from JWT_SECRET.
 *
 * Throws if JWT_SECRET is unset in any environment. A previous version of
 * this project shipped a hardcoded fallback secret in source — anyone with
 * access to the repository could forge tokens. This helper ensures the
 * secret MUST come from the environment.
 *
 * In production the absence of JWT_SECRET is a fatal configuration error;
 * the middleware also throws at boot in production. In development, the
 * helper still throws on first call so misconfiguration surfaces immediately
 * rather than silently using a baked-in secret.
 */
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is not set. This is required.'
    );
  }
  return new TextEncoder().encode(secret);
}
