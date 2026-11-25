---
name: security-headers
description: "Write HTTP security header configs for Cloudflare, Vercel, Netlify, nginx, and Next.js in Claude Code, Codex, Cursor, and other coding agents, covering HSTS, report-only CSP first, frame-ancestors, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy. This standalone squirrelscan skill needs no squirrel CLI or hosted squirrelscan MCP server and verifies live headers with curl. Use when asked \"add security headers to Next.js\", \"set up a CSP\", or \"fix missing HSTS and Referrer-Policy headers\"."
license: See LICENSE file in repository root
compatibility: Works without the squirrel CLI; curl is enough. The squirrel CLI is optional, for verification
metadata:
  author: squirrelscan
  version: "0.1.2"
allowed-tools: Bash(curl:*) Bash(squirrel:*) Read Edit Grep Glob
---

# Security Headers

Write the HTTP security headers for a site and put them where the platform wants them: Cloudflare, Vercel, Netlify, nginx or Next.js. No squirrel CLI is needed; `curl` is enough.

Headers reduce the damage of some attacks (clickjacking, MIME sniffing, downgrade to http, injected scripts). They do not fix a vulnerable app. A missing header is a finding to fix; a full set of headers is not proof the site is secure.

## Step 1: see what is sent now

```bash
curl -sI https://example.com | grep -i -E '^(strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy|cross-origin|set-cookie)'
```

Check a page, not only the homepage, and the response a browser gets (not a cached one from a CDN with other rules). Note which headers are already set and by what: the app, the CDN or the host.

## Step 2: the baseline set

OWASP's secure headers project (https://secure-headers-project.owasp.org/best-practices) proposes this baseline:

| Header | Value | Notes |
|--------|-------|-------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | HTTPS only. Start with a short `max-age` (for example 300) on a site you are unsure about. Add `preload` only when every subdomain is HTTPS for good, since it is hard to undo |
| `X-Content-Type-Options` | `nosniff` | |
| `Content-Security-Policy` | start from `default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; frame-ancestors 'none'` | Then allow only what the site really loads. See step 3 |
| `X-Frame-Options` | `DENY` (or `SAMEORIGIN` if you frame your own pages) | Old browsers. CSP `frame-ancestors` is the modern control; OWASP advises setting both for defense in depth |
| `Referrer-Policy` | `strict-origin-when-cross-origin` (or `no-referrer`) | OWASP proposes `no-referrer`; the middle value keeps analytics working |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | List only features the site does not use; add others as needed |

If the site must be framed by a partner, use `frame-ancestors https://partner.example` and drop `X-Frame-Options` (it cannot name a host).

## Step 3: roll CSP out safely

A strict CSP breaks pages that rely on inline scripts, third-party widgets and analytics. Do not ship it blind:

1. Send it as `Content-Security-Policy-Report-Only` first, with a `report-to` / `report-uri` endpoint if the user has one, and watch the browser console.
2. Replace `'unsafe-inline'` with nonces or hashes where the framework supports them (Next.js and others can issue a per-request nonce).
3. Add each legitimate origin to the right directive (`script-src`, `style-src`, `img-src`, `connect-src`, `frame-src`).
4. Switch to enforcing `Content-Security-Policy` when the console is clean on the main flows (sign-in, checkout, forms).

## Step 4: put it where it belongs

**Next.js** (`next.config.ts`):

```ts
const headers = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];
export default { async headers() { return [{ source: "/(.*)", headers }]; } };
```

**Vercel** (`vercel.json`):

```json
{ "headers": [{ "source": "/(.*)", "headers": [
  { "key": "X-Content-Type-Options", "value": "nosniff" },
  { "key": "X-Frame-Options", "value": "DENY" },
  { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
] }] }
```

**Netlify** (`_headers` in the publish directory):

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**nginx** (in the `server` block; `always` adds the header on error responses too):

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

nginx drops parent `add_header` lines when a nested `location` sets its own: repeat them there.

**Cloudflare**: Rules, Transform Rules, Modify Response Header: add each header as "Set static" for the hostname. Turn on Always Use HTTPS in SSL/TLS, Edge Certificates. Keep one source for each header: if the origin also sets it, check the response for a duplicate.

**WordPress, Shopify, Webflow**: headers are set at the host or CDN in front (a Cloudflare rule, the host's `.htaccess` or panel). Shopify and Webflow limit what the owner can set; say what is not changeable instead of promising it.

## Step 5: verify

Re-run the `curl -sI` check against the live URL, load the main flows with the console open for CSP violations, and, if the squirrel CLI is installed, confirm with the matching audit rules:

```bash
squirrel audit https://example.com --rule-include security/csp,security/hsts,security/x-frame-options,security/x-content-type,security/referrer-policy,security/permissions-policy --passive --format llm
```

`--passive` sends nothing beyond the crawl. For sites the user does not own, add `--ephemeral`.

## Stop condition

Stop when the live response carries the agreed headers on the pages checked, nothing the site needs is blocked in the console, and CSP is enforcing (or the user has accepted report-only for now, written down). Tell the user which headers the platform did not let them set.

## Hand off

Everything else in security (leaks, exposed files, cookies, probes): `security-audit`. Supabase: `supabase-security-audit`. Gate it: `website-ci-gate`.
