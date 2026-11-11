# Canonical workflow explorer

The user approved promoting this explorer to the default website on 12 November 2026. `../index.html` is the canonical deliverable. `../preview.html` and `../workflow-demo.html` are byte-identical compatibility aliases, not separate variants. The previous simpler site is frozen in `../archive/simple-workflows-2026-11-12.html`.

## Sources and build

- `dialog.html`: accessible native dialog, keyboard tabs, scenario choices, source/prepared/destination panels and persistent review controls.
- `styles.css`: scoped responsive styles, inheriting the existing green/lime palette and local Inter font.
- `workflows.js`: sample data, calculations, review/exception paths and source-field highlighting.
- `../scripts/build-preview.mjs`: one canonical build composing the homepage, this richer dialog and shared behavior, with embedded resources. Uses `apply_patch` to refresh all three entry aliases. Stop and review if expected source boundaries change.
- `../scripts/build-workflow-demo.mjs`: compatibility wrapper for the canonical build; it cannot regenerate an older variant.

Run from the repository root:

```sh
node scripts/build-preview.mjs --apply
node scripts/build-preview.mjs --check
node --test scripts/build-preview.test.mjs scripts/build-workflow-demo.test.mjs scripts/build-logo-comparison.test.mjs
node scripts/check-workflow-demo.cjs index.html
node scripts/check-preview.cjs
node scripts/check-polish.cjs
```

## Six scenarios

1. Enquiries / complete: capture service, sites and postcode; prepare a draft; simulate creating a lead and follow-up task for the service coordinator.
2. Enquiries / missing details: identify missing scope information; draft questions; simulate a clarification task while holding the quote.
3. Documents / complete: verify a sample purchase order, quantity, unit price, tax and total; prepare an accounts-entry draft only.
4. Documents / missing references: no currency/order assumption; route the invoice to an accounts reviewer without preparing an entry draft.
5. Reporting / complete: join two sample registers by quote ID, compare accepted quote value with the prior sample week, and prepare an internal report preview plus a follow-up prompt.
6. Reporting / missing value: withhold the total and comparison; hold the report for correction instead of filling the gap.

Invoice arithmetic: 12 × AUD 40 = AUD 480 subtotal; 10% GST = AUD 48; total = AUD 528. Reporting arithmetic: accepted values 1,250 + 1,800 = AUD 3,050, compared with AUD 2,600 for the prior sample week; change = AUD 450 / 17.3% rounded. Both accepted quote IDs match a job; one pending quote exceeds the seven-day follow-up threshold. Accepted quote value is not recognised revenue.

All names, records, documents and figures are fictional. No real AI, email, CRM, accounting, payment or reporting connection is made. State stays in the page and resets when switching scenarios or reopening the explorer. The existing contact action still prepares a local brief; it does not submit an enquiry.

The polished explorer keeps reading/record text at 14px and secondary text at least 12px. Mobile uses a compact header and shorter introductions, with prepared work before the source disclosure. Source and prepared panels move in the DOM to keep reading/keyboard order consistent with the responsive layout. Resizing does not reset a chosen scenario or result. The polish check verifies desktop service links/deliverable alignment, mobile font sizes, short-screen visibility and preserved simulation state. All entry aliases now expose this same experience.

Browser evidence is saved under `/workspace/reviews/canonical-workflows/`, separated by entry filename. The browser check defaults to the actual `index.html`; pass `preview.html` or `workflow-demo.html` to check those aliases explicitly. It tests all six paths, source highlighting, resets, tabs/Escape/focus, mobile controls and overflow, plus shared contact/menu/policy actions in isolated offline HTML. Axe checks run when the existing audit helper is available; these are bounded checks, not accessibility certification.
