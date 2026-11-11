# Noviqa website prototype

A responsive homepage for Noviqa, an AI auditing, consulting and implementation business serving SMEs. The selected design combines a dark-green/lime workflow introduction with a technical architecture illustration and plain-language consulting copy. The user selected the Converge identity for the header, footer and browser icon. Messaging is geographically neutral.

## Preview

Open **`index.html`** in the file visualization panel. It is the current website, including the full richer workflow explorer and Converge branding. It is self-contained: styles, scripts, fonts, icons and the illustration are embedded. **`preview.html` and `workflow-demo.html` are byte-identical compatibility aliases**, so older links show the same current website. JavaScript interactions require a viewer that permits scripts.

The delivered `index.html` also works directly in a browser without its neighboring source files. For a development server, use `python3 -m http.server 4173 --bind 0.0.0.0`. The server must be restarted after an environment restart.

Edit `app.html`, `styles.css`, shared behavior in `script.js`, the explorer sources in `workflow-demo/`, and `assets/`, then regenerate **all three** entry files with `node scripts/build-preview.mjs --apply`. This is the single canonical build and uses `apply_patch`; it always includes the richer explorer. Check freshness with `node scripts/build-preview.mjs --check`. Run the Node tests with `node --test scripts/build-preview.test.mjs scripts/build-workflow-demo.test.mjs scripts/build-logo-comparison.test.mjs`, then `node scripts/check-preview.cjs`, `node scripts/check-workflow-demo.cjs index.html` and `node scripts/check-polish.cjs`. The browser checks use preinstalled environment tooling, not an application dependency. `--patch` emits an update patch; no flags emits the standalone HTML to standard output.

Project memory and mandatory handoff checks are saved in [AGENTS.md](AGENTS.md).

Fresh pre-merge QA and inspected screenshots are in [release-qa-2026-11-12.md](release-qa-2026-11-12.md). This is a passing prototype/repository review, not a claim that enquiry delivery, legal policies or production hosting are complete.

### Noviqa logo comparison

Open **`logo-comparison.html`** to compare the shortlisted **Current** and **Converge** designs in the actual homepage. Use the two buttons above the header to switch the header, footer, browser icon and light/dark icon-size samples together. This separate, self-contained test version uses the richer workflow examples. It does not replace `index.html`, `preview.html` or `workflow-demo.html`, and does not enable enquiry delivery.

The approved business name is Noviqa and domain is `noviqa.com.au`. **Converge is the selected design and is applied to the main site.** Current remains available only as a comparison alternative. The artwork is generated transparent PNG, not finished vector brand masters. Final vector production and trademark/similarity checks remain outstanding.

Edit `brand-preview/` and `assets/brand/`, then run `node scripts/build-logo-comparison.mjs --apply`. Validate with `--check`, `node --test scripts/build-logo-comparison.test.mjs` and `node scripts/check-logo-comparison.cjs`. The latter checks both identities offline at desktop/mobile widths and exercises all six workflow scenarios under each. Shared homepage changes also require rebuilding this comparison. See `assets/brand/README.md` and the latest section of `design-qa.md` for provenance and test limits.

The selected main-site branding lives in `app.html` and `styles.css`, using `assets/brand/converge-lockup.png` and `converge-symbol.png`. Run `node scripts/check-brand.cjs` to check all three entry files at seven widths with scripts both enabled and disabled. This also captures source/testbed versus main-site visual comparisons. Branding renders without JavaScript; interactive demos still require it.

### Workflow explorer and archived simpler version

On **12 November 2026**, the user approved making the richer workflow version the default. Each workflow now available in `index.html` has a complete-data case and a missing-information case, source/prepared/result panels, and the latest mobile and wording refinements. Reporting calculations use fictional records, not client results. No AI or external service is called.

Explorer sources remain in `workflow-demo/`; these are live main-site sources, not an alternate website. The old `node scripts/build-workflow-demo.mjs --apply` command delegates to the canonical build and refreshes all three aliases. Do not edit generated HTML directly or copy the base template over index. The older simple sample definitions in `script.js` and base dialog in `app.html` are replaced during composition; edit `workflow-demo/` for real explorer changes.

The previous simpler site is preserved exactly at [`archive/simple-workflows-2026-11-12.html`](archive/simple-workflows-2026-11-12.html). It is a frozen historical snapshot, never a build target or current preview. Its checksum is recorded in `archive/README.md` and protected by a regression test.

## Structure

- `app.html`: editable HTML source template, semantic navigation, FAQ disclosures, and native dialogs. This template requires its source assets and is not the standalone handoff file.
- `index.html`: generated, self-contained current website, including the richer explorer; canonical file to open.
- `styles.css`: responsive layout, local font declarations, and visual states.
- `script.js`: shared mobile menu, contact/brief and policy behavior; its older sample block is not used by the shipped explorer.
- `workflow-demo/`: live explorer markup, styles, fictional sample data and interactions.
- `preview.html` and `workflow-demo.html`: identical generated aliases of `index.html`. One build refreshes all three.
- `archive/`: frozen historical simpler site, excluded from generation.
- `assets/`: source Inter fonts, Tabler icons and the technical architecture illustration, embedded into the generated documents. See `assets/README.md` for provenance and licences.
- No package installation, external asset requests, analytics or backend. A small packaging command embeds source files into the standalone entry documents.
- Workflow diagrams are illustrative. No invented clients or performance metrics are used.

## Before launch

1. Produce final vector/logo masters and review type licensing and trademark/similarity clearance for the selected Converge identity. Noviqa's name, selected logo, page title and favicon are already applied.
2. Connect the primary action to the real scheduling URL or implement and test a contact service. Currently, visitors can prepare and copy a workflow brief locally; no enquiry is submitted. Update the preview notices and privacy information when a real service is connected.
3. Supply actual business contact details and reviewed privacy/terms pages appropriate to the final services used.
4. Confirm service descriptions and support commitments with the founders.
5. Add the final domain, social preview image, favicon, sitemap, and search metadata.
6. Check accessibility, mobile layouts, and the complete enquiry journey on the chosen host.

This is a local design prototype, not a published website. No booking or enquiry is submitted. Briefs remain in page memory and are not persisted; users can explicitly copy a brief to their own clipboard. The technical architecture illustration is labelled as illustrative, not a claim about a deployed client system. Founder names, photographs, and experience still need to be supplied before a biography can be added.

## Research behind the examples (15 October 2026)

These sources informed the choice of workflow patterns, not claims of our experience or results:

- Morningside, Asmuss case study: enquiry handling, CRM administration, workflow mapping, and prioritisation. Its savings are roadmap projections, not evidence of our own results: https://www.morningside.ai/case-study/building-new-zealands-first-ai-enabled-industrial-distributor
- Morningside, service process: discovery, implementation, and adoption: https://www.morningside.ai/services
- Neurastruct: document/quote processing, human review, and clearly scoped engagements. Its product, prices, timings, hosting, and ownership promises have not been adopted: https://neurastruct.com.au/
- Microsoft, document extraction: https://learn.microsoft.com/ai-builder/form-processing-model-in-flow
- Microsoft, approval workflows: https://learn.microsoft.com/en-us/power-automate/modern-approvals

The three interactive samples use fictional inputs and deterministic, pre-written outputs. Buttons simulate a review or exception-routing step locally; they do not call AI, send messages, post invoices, or connect to accounts. Reset and switching examples clear the simulation state.

AI auditing and consulting are paid, standalone engagements. Implementation is a separate paid engagement. Scope, deliverables and fees are agreed before either begins; an audit does not oblige the client to purchase a build. Handover and ongoing support are defined in the build proposal. No specific prices, durations or savings are promised.
