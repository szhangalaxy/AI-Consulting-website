# AGENTS.md

## Project overview

This repository contains a responsive, dependency-free prototype homepage for an AI automation consultancy serving small and medium-sized businesses.

- `index.html` is the complete application: markup, styles, and client-side behavior.
- `README.md` documents the prototype, research context, launch gaps, and preview instructions.
- The temporary brand name is `[Company Name]`.
- The site is a local prototype, not a production booking or data-collection service.

## Working principles

- Read `README.md` and the relevant parts of `index.html` before making changes.
- Preserve the single-file, dependency-free architecture unless the task explicitly calls for a larger restructuring.
- Do not add packages, build tooling, external fonts, analytics, trackers, or third-party assets without explicit approval.
- Keep messaging geographically neutral until approved business details are provided.
- Do not invent customer names, testimonials, performance metrics, prices, timelines, guarantees, or service commitments.
- Keep sample inputs and outputs clearly fictional and deterministic. Do not imply that the prototype calls live AI or connected systems.
- Maintain human-review language for sensitive communications, uncertain results, payments, and other consequential actions.
- Never add real credentials, personal information, customer data, API keys, or secrets to the repository.

## Implementation conventions

- Use semantic HTML and progressive enhancement.
- Preserve keyboard support, visible focus styles, meaningful labels, status announcements, and reduced-motion behavior.
- Keep layouts responsive across desktop and mobile breakpoints.
- Prefer the existing CSS custom properties and visual language before introducing new styles.
- Use plain JavaScript with no framework dependencies.
- Keep interactive controls usable with keyboard and assistive technology, including correct ARIA state updates.
- Avoid inline claims that are not supported by approved evidence. Research sources may inform examples but must not be presented as this consultancy's results.

## Validation

After changing the site:

1. Open `index.html` directly, or run `python -m http.server 4173 --bind 127.0.0.1` from the repository root.
2. Check the desktop and narrow mobile layouts.
3. Test navigation, workflow tabs, arrow-key tab behavior, simulated approval/reset controls, FAQ disclosures, and dialogs.
4. Confirm focus visibility, sensible tab order, and reduced-motion behavior.
5. Confirm that no booking is submitted, no personal information is collected, and no prototype copy implies otherwise.
6. Review `git diff` and keep unrelated user changes intact.

## Launch-sensitive areas

Do not treat placeholders as finished production content. Before launch, approved branding, scheduling, contact details, legal pages, metadata, favicon, social image, sitemap, hosting, accessibility testing, and the end-to-end enquiry journey still require confirmation or implementation as described in `README.md`.
