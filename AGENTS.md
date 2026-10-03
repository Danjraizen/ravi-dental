# Dr. Ravi Dental Website — Working Instructions

## Project purpose

This repository is the Astro website for Dr. Ravi Dental Clinic in Mogappair, Chennai. The production site is `https://www.mogappairdentalclinic.com`.

Before making a recommendation or change, read `docs/PROJECT-HANDOFF.md`. It records the current platform, completed work, priorities, and open verification items.

## Working rules

- Treat the live website, DNS, analytics, forms, and Google Business Profile as production systems. Inspect and report before making externally visible changes unless the user explicitly requests the change.
- Do not expose, commit, or paste credentials, API keys, analytics login data, passwords, or personal patient information.
- Keep SEO recommendations specific to the clinic, local intent, and the relevant service page; avoid generic keyword stuffing or unsupported medical claims.
- For code changes, preserve canonical URLs, redirects, structured data, analytics events, accessibility, and the existing visual design unless a requested change requires otherwise.
- Validate code changes with `npm run build` before handing off.
- Record material decisions, completed work, and remaining verification in `docs/PROJECT-HANDOFF.md` so a new Codex chat or account can continue without relying on earlier chat history.

## Starting a new task

1. Read `docs/PROJECT-HANDOFF.md` and the relevant source files.
2. State the exact goal, scope, and whether it affects production.
3. Make the smallest safe change that achieves the goal.
4. Verify the result and update the handoff document if status, decisions, or next steps changed.
