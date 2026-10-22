const TURNSTILE = "https://challenges.cloudflare.com";

/** Origins the site really talks to; anything else is blocked by the browser. */
function policy(development: boolean): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // Next injects inline bootstrap scripts and the site sets the theme before paint.
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      TURNSTILE,
      ...(development ? ["'unsafe-eval'"] : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", "https://i.scdn.co"],
    "media-src": ["'self'", "blob:"],
    "font-src": ["'self'"],
    "connect-src": ["'self'", "data:", "blob:", TURNSTILE, ...(development ? ["ws:"] : [])],
    "frame-src": [TURNSTILE],
    "worker-src": ["'self'", "blob:"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");
}

export function securityHeaders(development: boolean) {
  return [
    { key: "Content-Security-Policy", value: policy(development) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  ];
}
