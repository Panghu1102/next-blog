/**
 * Kept until `npm run cf-typegen` can regenerate `env.d.ts` from a Wrangler
 * configuration containing the real D1 database ID. Do not expose this binding
 * to client components.
 */
declare namespace Cloudflare {
  interface Env {
    blogcms: D1Database;
  }
}
