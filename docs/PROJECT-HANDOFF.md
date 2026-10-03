# Dr. Ravi Dental Website — Project Handoff

Last updated: 2026-10-03

## Use this file first

This is the durable context for continuing the dental-website work from a new Codex account, chat, or machine. Read [`../AGENTS.md`](../AGENTS.md) first, then this document. Do not treat old chat transcripts as the only source of truth.

## Business and site

- Clinic: Dr. Ravi Dental Clinic
- Primary local market: Mogappair, Chennai
- Production site: <https://www.mogappairdentalclinic.com>
- Primary domain: `www.mogappairdentalclinic.com`; the apex domain redirects to `www`.
- Primary outcome: qualified local enquiries via call, WhatsApp, contact form, and directions.

## Technical setup

- Site stack: Astro static site.
- Hosting: Vercel project `ravi-dental`.
- Source repository: this repository, `Danjraizen/ravi-dental` on GitHub.
- The old cPanel/WordPress hosting is no longer needed for the website. Domain email accounts were reported not to be associated with the old server.
- Local validation command: `npm run build`.

## Completed work

- The original website was migrated to Astro while preserving routes, visual assets, metadata, canonical URLs, Open Graph/Twitter tags, structured data, `robots.txt`, sitemap, and Google verification.
- The migration audit previously reported 25 static routes, no static accessibility issues, and no audit issues.
- Google Search Console verification and sitemap submission were completed; indexing was requested.
- Google Business Profile website URL points to production.
- GA4 base tracking is installed with measurement ID `G-Y6TGNMMGYT`.
- Production lead events were added and deployed: `phone_click`, `whatsapp_click`, `email_click`, `map_interaction`, `form_submit_attempt`, and `generate_lead` on `/contact/?submitted=true`.
- WhatsApp calls-to-action prefill the current page or treatment name. The deployed commits recorded in history are `a2bfa16` (lead tracking) and `3b91ad3` (WhatsApp enquiry context).

## Current priorities

1. Test GA4 events in Realtime or DebugView.
2. Submit a real contact-form test and confirm receipt.
3. Confirm FormSubmit activation/delivery for `info@ravidentalclinic.com`.
4. Mark agreed GA4 events as conversions, especially `generate_lead`, `phone_click`, and `whatsapp_click`.
5. Review Google Business Profile completeness, obtain approved clinic/team photos, and establish a genuine review workflow.

### SEO growth priorities

- Dentist in Mogappair; Root Canal Treatment in Mogappair; Dental Implant in Mogappair; Teeth Whitening in Mogappair; Invisible Aligners in Mogappair.
- TMJ Pain Treatment in Chennai; Orofacial Pain Specialist in Chennai; Emergency Dentist in Mogappair.

Each page needs accurate local-intent content, doctor/clinic credibility, FAQs, internal links, clear call/WhatsApp CTAs, and appropriate schema.

## Guardrails

- Never invent treatment outcomes, prices, credentials, reviews, patient testimonials, or medical claims.
- Never store secrets or patient information in this repository.
- Treat analytics, form configuration, DNS, Google Business Profile, and deployments as production: get explicit authorization before changing external settings.
- Preserve redirects, canonical URLs, structured data, accessibility, and event names unless a deliberate migration is being made.

## New-account continuation

Open this repository as a local Codex project. Start a focused chat, ask it to read `AGENTS.md` and this handoff, and update this file after every material verified task with the result, commit/deployment reference, and next item.

## Old-account reference

Old chats may be useful for reference but are not needed to continue work. Keep any exports/share links separately and never include authentication tokens.
