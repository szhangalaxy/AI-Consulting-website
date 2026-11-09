# AI consulting website prototype

A responsive homepage for an AI auditing, consulting and implementation business serving SMEs. The selected design combines a dark-green/lime workflow introduction with a technical architecture illustration and plain-language consulting copy. Company branding is temporarily `[Company Name]`. Messaging is geographically neutral.

## Preview

Open **`index.html`** in the file visualization panel. It is self-contained: styles, scripts, fonts, icons and the illustration are embedded. `preview.html` is an identical compatibility copy, so older preview links work too. JavaScript interactions require a viewer that permits scripts.

The delivered `index.html` also works directly in a browser without its neighboring source files. For a development server, use `python3 -m http.server 4173 --bind 0.0.0.0`. The server must be restarted after an environment restart.

Edit `app.html`, `styles.css`, `script.js` and `assets/`, then regenerate **both** delivered files with `node scripts/build-preview.mjs --apply` (uses the Codex `apply_patch` command and succeeds if already current). Check freshness with `node scripts/build-preview.mjs --check`; run the regression checks with `node --test scripts/build-preview.test.mjs` and `node scripts/check-preview.cjs`. The browser check uses preinstalled environment tooling, not a new application dependency. `--patch` emits an update patch; no flags emits the standalone HTML to standard output.

Project memory and mandatory handoff checks are saved in [AGENTS.md](AGENTS.md).

### Alternate workflow demo

Open **`workflow-demo.html`** to compare the same homepage with richer interactive examples. The original `index.html` and `preview.html` are unchanged. Each example has a complete-data case and a missing-information case, with visible simulated destination records. Reporting calculations use fictional records, not client results. No AI or external service is called.

Editable alternate sources live in `workflow-demo/`. Generate with `node scripts/build-workflow-demo.mjs --apply`, check with `node scripts/build-workflow-demo.mjs --check`, and test with `node --test scripts/build-workflow-demo.test.mjs` plus `node scripts/check-workflow-demo.cjs`. The build reuses the approved homepage and shared contact/menu behaviour without replacing the original files. Regenerate the alternate if shared homepage sources change.

## Structure

- `app.html`: editable HTML source template, semantic navigation, FAQ disclosures, and native dialogs. This template requires its source assets and is not the standalone handoff file.
- `index.html`: generated, self-contained website and canonical file to open.
- `styles.css`: responsive layout, local font declarations, and visual states.
- `script.js`: workflow examples, keyboard navigation, mobile menu, and a local workflow-brief composer.
- `preview.html`: identical generated copy of `index.html` for existing preview links. Regenerate both after editing the source.
- `assets/`: source Inter fonts, Tabler icons and the technical architecture illustration, embedded into the generated documents. See `assets/README.md` for provenance and licences.
- No package installation, external asset requests, analytics or backend. A small packaging command embeds source files into the standalone entry documents.
- Workflow diagrams are illustrative. No invented clients or performance metrics are used.

## Before launch

1. Replace `[Company Name]`, the temporary brand mark, and page metadata with approved branding.
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
