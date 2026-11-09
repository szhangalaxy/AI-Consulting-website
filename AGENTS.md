# Project memory and handoff requirements

This file is project-scoped memory for future coding agents. Read it before changing this website.

## Critical: the actual index.html must work in isolation

The user reviews the website in a file visualization panel. That panel may load only the selected HTML document, without neighboring CSS, scripts, fonts or images. A modular `index.html` repeatedly appeared unstyled with broken images. Creating a separate `preview.html` did not prevent the user from reopening `index.html` and hitting the same failure.

- Keep **both `index.html` and `preview.html` self-contained and identical**. Embed CSS, JavaScript, fonts, icons, favicon and illustration. Neither file may require adjacent files, a server, a CDN, or a `<base>` URL to render.
- Edit **`app.html`**, `styles.css`, `script.js`, and `assets/` as the source. `app.html` is a source template, not the file to hand to the user. Do not replace the generated `index.html` with the modular template.
- After every source change, regenerate both delivered files with `node scripts/build-preview.mjs --apply`. This uses `apply_patch` and safely does nothing when already current. `--patch` remains available to emit a patch for other tooling.
- Run `node scripts/build-preview.mjs --check` to reject stale output or relative resource references.
- Run `node --test scripts/build-preview.test.mjs` and `node scripts/check-preview.cjs` before handoff. The browser check uses the cloud environment's preinstalled Playwright and Chromium; it is a development check, not an application dependency.
- The browser check must load the actual **`index.html` contents in an isolated document with networking disabled**, inspect stylesheet/font/image loading, and exercise the demos and main brief action. A healthy localhost server does not establish that the file visualization works.
- Inspect the generated screenshots. Test desktop and mobile. Report any viewer-specific script/CSP limitation honestly if observed; never describe a queued panel request as a successfully visible preview.
- Link the user to `index.html` as the canonical artifact. `preview.html` remains a compatible alias so older links keep working.
- The user also requested a separate richer-demo version: `workflow-demo.html`, built from `workflow-demo/` with `node scripts/build-workflow-demo.mjs --apply`. Keep this alternate self-contained too; do not promote it over or overwrite the original without approval. Check it with `--check`, `node --test scripts/build-workflow-demo.test.mjs` and `node scripts/check-workflow-demo.cjs`. If shared homepage sources change, regenerate and test the alternate as well.

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

- Use the existing checkout; do not create another worktree unless the user requests one.
- Preserve unrelated edits. Keep the website dependency-free at runtime.
- Local changes are not automatically pushed to GitHub or published. Do not claim otherwise.
- Competitor findings and source limits are in `competitor-review.md`; visual QA history is in `design-qa.md`.
