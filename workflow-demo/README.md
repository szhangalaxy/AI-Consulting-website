# Alternate workflow explorer

`../workflow-demo.html` is the standalone deliverable. It retains the approved homepage but replaces the three text-based samples with richer deterministic interactions. `index.html`, `preview.html` and their source files remain unchanged by this variant.

## Sources and build

- `dialog.html`: accessible native dialog, keyboard tabs, scenario choices, source/prepared/destination panels and persistent review controls.
- `styles.css`: scoped responsive styles, inheriting the existing green/lime palette and local Inter font.
- `workflows.js`: sample data, calculations, review/exception paths and source-field highlighting.
- `../scripts/build-workflow-demo.mjs`: composes the main homepage, swaps only the sample dialog/behaviour, and embeds all resources. Uses `apply_patch` to write only the alternate output. Stop and review if its expected source boundaries change.

Run from the repository root:

```sh
node scripts/build-workflow-demo.mjs --apply
node scripts/build-workflow-demo.mjs --check
node --test scripts/build-preview.test.mjs scripts/build-workflow-demo.test.mjs
node scripts/check-workflow-demo.cjs
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

The polished explorer keeps reading/record text at 14px and secondary text at least 12px. Mobile uses a compact header and shorter introductions, with prepared work before the source disclosure. Source and prepared panels move in the DOM to keep reading/keyboard order consistent with the responsive layout. Resizing does not reset a chosen scenario or result. The polish check also verifies aligned desktop service links/deliverable rows in both delivered variants, mobile font sizes, short-screen visibility and preserved simulation state.

Browser evidence is saved under `/workspace/reviews/workflow-demo/`. The browser check loads the exact delivered HTML in an isolated, offline document, tests all six paths, source highlighting, resets, tabs/Escape/focus, mobile controls and overflow, plus shared contact/menu/policy actions. Axe checks run when the existing audit helper is available; these are bounded checks, not accessibility certification.
