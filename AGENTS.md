# AGENTS.md

## Project overview

This repository contains a responsive, dependency-free prototype homepage for an AI automation consultancy serving small and medium-sized businesses.

- `index.html` is the complete application: markup, styles, and client-side behavior.
- `README.md` documents the prototype, research context, launch gaps, and preview instructions.
- The approved business name is Noviqa; the selected logo direction is Converge.
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

## Current authoring and delivery

The approved website updates retain self-contained, dependency-free HTML delivery. Editable sources now live in app.html, styles.css, script.js and workflow-demo/. Packaging embeds local assets into the delivered files; it adds no runtime service dependency. The detailed project memory below records these approved changes and their regression checks.

# Project memory and handoff requirements

This file is project-scoped memory for future coding agents. Read it before changing this website.

## Critical: the actual index.html must work in isolation

The user reviews the website in a file visualization panel. That panel may load only the selected HTML document, without neighboring CSS, scripts, fonts or images. A modular `index.html` repeatedly appeared unstyled with broken images. Creating a separate `preview.html` did not prevent the user from reopening `index.html` and hitting the same failure.

- **On 12 November 2026 the user approved promoting the richer workflow website to the default.** Keep **`index.html`, `preview.html` and `workflow-demo.html` self-contained and byte-identical**. All three now include the full richer explorer and selected Converge branding. `index.html` is the canonical handoff; the other two are compatibility aliases, not different variants. Embed CSS, JavaScript, fonts, icons, favicon and illustration. No neighboring files, server, CDN or `<base>` URL may be required to render.
- Edit **`app.html`**, `styles.css`, `script.js`, `workflow-demo/` and `assets/` as source. `workflow-demo/dialog.html`, `styles.css` and `workflows.js` own the live explorer. `script.js` supplies shared menu/contact/policy behavior from its `const menuToggle =` boundary; its older sample definitions and the base template's old dialog are not the shipped explorer. Do not edit those older samples expecting to change the live workflows. `app.html` is a modular template, not a handoff document.
- After every source change, regenerate all three entry files with `node scripts/build-preview.mjs --apply`. This single canonical build always composes the richer explorer; it cannot emit the simpler variant through its public API/CLI. `scripts/build-workflow-demo.mjs` is only a compatibility wrapper delegating to the same build, including on `--apply`. `--patch` remains supported.
- Run `node scripts/build-preview.mjs --check` to reject stale output or relative resource references.
- Run `node --test scripts/build-preview.test.mjs` and `node scripts/check-preview.cjs` before handoff. The browser check uses the cloud environment's preinstalled Playwright and Chromium; it is a development check, not an application dependency.
- The browser check must load the actual **`index.html` contents in an isolated document with networking disabled**, inspect stylesheet/font/image loading, and exercise the demos and main brief action. A healthy localhost server does not establish that the file visualization works.
- Inspect the generated screenshots. Test desktop and mobile. Report any viewer-specific script/CSP limitation honestly if observed; never describe a queued panel request as a successfully visible preview.
- Link the user to `index.html` as the canonical artifact. `preview.html` remains a compatible alias so older links keep working.
- Run `node --test scripts/build-preview.test.mjs scripts/build-workflow-demo.test.mjs scripts/build-logo-comparison.test.mjs`, then `node scripts/check-workflow-demo.cjs index.html` (all six scenarios and responsive states). The browser command can also test `preview.html` and `workflow-demo.html` explicitly. Run `node scripts/check-polish.cjs` for mobile readability and alignment.
- Preserve `archive/simple-workflows-2026-11-12.html` as a **frozen exact snapshot** of the simpler pre-promotion site. Do not regenerate or use it as the current website. Its SHA-256 is pinned in the tests and archive README. Do not restore the simpler explorer to index/preview; the earlier separate-variant rule is superseded by the user's promotion approval.

## Product and copy decisions to preserve

- This is an AI auditing, consulting and implementation business serving SMEs.
- Approved content step 1 makes auditing/consulting explicit in the hero, introduces “AI audits. Practical automation.” and labels the three workflow cards as build examples. Keep the standalone roadmap option visible; the user is reviewing the remaining content sections one step at a time, not authorising a wholesale rewrite.
- Approved content step 2 makes the three deliverables concrete: prioritised AI opportunities and a next-step roadmap; a working workflow tested against agreed examples; handover materials/support as agreed in the build scope. The third stage label is “Handover & support”. Fees, independent audit value and scope qualifications remain unchanged.
- Approved content step 3 uses “Preview” action buttons in the richer explorer, “Show in invoice”/“Show invoice total” source links, and “Accepted quotes matched / 2 of 2 / to confirmed jobs”. These are wording changes only; preserve the fictional data, calculations, human-review boundaries and exception behaviour.
- The AI audit/consulting engagement is **paid**. Implementation is a **separate paid engagement**. Scope, deliverables and fees are agreed before either begins.
- Present that commercial structure subtly: use “AI audit & consulting” and “Implementation” as stage labels, without “Paid”. Explain that engagements are scoped separately with deliverables and fees agreed before starting; do not repeatedly emphasise payment in the approach, FAQ or contact copy.
- The audit can be purchased independently; do not imply free assessment, require a build afterwards, invent a fee credit, or publish unapproved prices/timelines.
- Use the approved forest-green/lime technical direction and `assets/workflow-architecture.webp`. The user rejected the plant/books/ceramic still life as inappropriate for an AI/tech consultancy; do not restore it or other lifestyle decoration.
- Examples use fictional inputs and prewritten outputs. They are not real AI calls, client results or proof of delivered savings.
- Use straightforward copy without habitual em dashes or hyphenated sentence breaks. Keep conventional compounds such as “follow-up” and “medium-sized”, date ranges, record IDs and technical identifiers where appropriate. The user rejected the Receive / Check / Review / Result strip in all richer demos; do not restore it.
- Approach supporting text must remain readable on desktop and mobile: 14px section/stage labels and 16px deliverables, with sentence-case stage labels. Do not shrink these back to footnote sizes at mobile breakpoints.
- The richer explorer uses 14px reading/record text and at least 12px secondary text, a compact mobile header/intro, and prepared work first on mobile. DOM and keyboard order must follow the layout; responsive changes must preserve the selected scenario and result. Desktop service links and approach deliverables align through shared grid rows. Run `node scripts/check-polish.cjs` to protect these decisions.
- Do not invent branding, founder identities, credentials, testimonials, clients, financial results or hosting/compliance promises.
- Contact is currently a clearly labelled local brief composer. It does not submit enquiries. A real contact/booking route and reviewed policies are still required before launch.

## Workflow and state

- Approved business facts: the name is **Noviqa**, domain `noviqa.com.au`, receiving business inbox `info@noviqa.com.au`. These facts do not establish that hosting or enquiry delivery is configured. The user says the site is only in GitHub; a Formspree endpoint and live delivery validation are still pending. Do not invent the endpoint or label the local brief composer as sending.
- The user **selected Converge** (four mirrored double-elbow modules) after website testing. It is applied to the header, footer and favicon of all three identical website entries through shared `app.html`/`styles.css`. Reuse the exact `assets/brand/converge-lockup.png` and `converge-symbol.png`; do not regenerate, redraw, substitute Current, or revert to placeholder branding. The optical display crop preserves the tested proportions. Name/title/copyright are Noviqa. `node scripts/check-brand.cjs` checks three entry files across seven widths with scripts enabled and disabled and captures source/implementation comparisons.
- Preserve both **Current** and **Converge** in the separate `logo-comparison.html` as a reference, not a public selector on the main website. Source is `brand-preview/`, `assets/brand/` and `scripts/build-logo-comparison.mjs`; generate with `--apply`, validate with `--check`, `node --test scripts/build-logo-comparison.test.mjs`, and `node scripts/check-logo-comparison.cjs`. This testbed derives from the richer workflow demo, but does not replace any existing entry file. Keep it self-contained. Rebuild after changes to shared homepage sources. Selected raster assets are not vector masters; vector production, optical icon work and similarity/trademark clearance remain separate launch work. Selection does not authorise GitHub pushes or public deployment.

- Use the existing checkout; do not create another worktree unless the user requests one.
- Preserve unrelated edits. Keep the website dependency-free at runtime.
- Local changes are not automatically pushed to GitHub or published. Do not claim otherwise.
- Competitor findings and source limits are in `competitor-review.md`; visual QA history is in `design-qa.md`.
