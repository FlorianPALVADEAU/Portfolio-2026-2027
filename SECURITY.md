# Security policy

## Supported versions

Only the latest release deployed from `main` is supported.

## Reporting a vulnerability

Please do not open a public issue for security problems. Use GitHub's private vulnerability reporting under the Security tab of this repository.

You can expect an acknowledgement within 72 hours and a status update within 7 days.

## Hardening in place

- Every response carries a Content-Security-Policy limited to the origins the site uses (Cloudflare Turnstile and Spotify album covers), plus `nosniff`, a strict referrer policy, a restrictive permissions policy and HSTS.
- The contact form checks Cloudflare Turnstile and allows five attempts per address every ten minutes. That counter lives in memory on each serverless instance, so for a global quota add a Vercel Firewall rate-limit rule on the contact route.
