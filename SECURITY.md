# Security

Study Help stores customer contact details, project inquiries, uploaded documents and admin accounts. This file lists the protections in place, the rules every change must follow, and what is still open. Target: OWASP ASVS 5.0 Level 2.

## Stack and where data lives

| Data | Where | Who can read it |
| --- | --- | --- |
| Services, portfolio, approved reviews, FAQs | Postgres (Neon) | Public |
| Inquiries, notes, quotations, pending reviews | Postgres (Neon) | Signed-in admins only |
| Customer uploads | Supabase Storage, private bucket `inquiry-files` | Admins, through 60-second signed links |
| Site images | Supabase Storage, public bucket `site-media` | Public |
| Admin passwords | Postgres, scrypt hashes | Nobody (one-way) |
| Sessions | Postgres, SHA-256 of the cookie token | Server only |

The browser never talks to the database. The Supabase service role key is used only in `server-only` modules.

## Protections in place

**Authentication** (`lib/auth/`)
- Passwords hashed with scrypt; minimum 12 characters; unknown emails take the same time as wrong passwords.
- Session cookie: random 256-bit token, `HttpOnly`, `Secure` in production, `SameSite=Lax`, 7-day expiry. Only its hash is stored, so a database leak cannot be replayed as a login.
- Logout deletes the server session. Changing the password signs out every other device.
- Login is rate limited per browser and email (5 per 15 minutes) and per account across all addresses (20 per hour).
- There is no public sign-up. Admins are created with `db/create-admin.ts`.

**Authorization**
- `requireAdmin()` checks the session in the database at the start of every admin page, query, server action and the attachment download route. `proxy.ts` only redirects signed-out visitors; it is not the security boundary.

**Input and output**
- Every form is validated on the server with Zod, using explicit fields (no mass assignment).
- All queries go through Drizzle, which parameterizes values. The only raw SQL uses no user input.
- React escapes all output. There is no `dangerouslySetInnerHTML`. Admin-entered links must be `http(s)`.
- Public forms have a honeypot field and per-IP rate limits (inquiries 8/hour, uploads 10/hour, reviews 3/hour).
- Reviews are saved as `pending` and are public only after an admin approves them.

**File uploads** (`lib/inquiry-actions.ts`, `lib/file-signature.ts`)
- Allowed: pdf, doc(x), xls(x), ppt(x), csv, txt, png, jpg, zip. Max 10 MB each, 5 per inquiry.
- File names and sizes are read from the bucket, never trusted from the browser. Stored names are random.
- Each file's first bytes are checked against its extension, so a renamed executable is rejected and deleted.
- Downloads are forced as attachments, so an uploaded file can never run in the admin's browser.
- Site images: JPG, PNG and WebP only (SVG is blocked because it can contain scripts), 8 MB max.

**Browser headers** (`next.config.ts`)
- Content-Security-Policy, HSTS (2 years), `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`; `X-Powered-By` removed.
- The CSP allows `'unsafe-inline'` scripts because Next.js needs it for prerendered pages without nonces. Moving to nonces would make every page render per request.

**Logging** (`lib/security-log.ts`)
- Logins (success, failure, rate limited), logout, password changes and customer file downloads are written as JSON lines with `"type":"security"`. Find them in Vercel > Logs.
- Logs contain user ids and hashed IPs only: never passwords, tokens, cookies or email addresses.

## Rules for every change

1. Every new admin page, query, server action or route handler calls `requireAdmin()` first.
2. Validate every input on the server with Zod, even if the form already checks it.
3. Never build SQL from strings. Use Drizzle; if `sql` is needed, pass values as template parameters.
4. Secrets stay in environment variables without the `NEXT_PUBLIC_` prefix, and in modules that import `server-only`.
5. Never render user content as HTML. Never put customer files in the public bucket.
6. Public queries select only the fields the page shows.
7. Error messages to the public are generic. Details go to `console.error` on the server.
8. Before adding a third-party script, embed or image host, update the CSP and the privacy policy.
9. Run `pnpm audit --prod` before each release.

## Still open

| Priority | Item |
| --- | --- |
| P0 | Two-factor sign-in (TOTP) for admins |
| P1 | Idle session timeout (needs a `last_used_at` column on `sessions`) |
| P1 | Admin roles, if more than one person gets access |
| P1 | Retention policy: delete customer files and closed inquiries after a set period |
| P1 | Privacy policy reviewed against Sri Lanka's Personal Data Protection Act No. 9 of 2022 |
| P2 | Malware scanning of uploads |

## Settings outside the code

- **GitHub:** secret scanning, push protection, Dependabot alerts, branch protection on `main`.
- **Vercel:** production and preview environment variables kept separate, Deployment Protection on previews, team access limited.
- **Neon:** separate development and production branches or projects; check the backup and restore window; use a role that owns only this database.
- **Supabase:** `inquiry-files` must stay private; run `db/setup-storage.ts` after changing limits.
- **Credentials:** rotate any key immediately if it is exposed, starting with `SUPABASE_SERVICE_ROLE_KEY` and `DATABASE_URL`.

## Reporting a problem

Email the site owner. Do not open a public GitHub issue for a security problem.
