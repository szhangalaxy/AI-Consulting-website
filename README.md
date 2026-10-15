# AI consulting website prototype

A responsive, dependency-free homepage for an AI automation consultancy serving SMEs. Company branding is temporarily `[Company Name]`. Messaging is geographically neutral.

## Preview

Open `index.html` directly in a browser, or serve this directory with `python -m http.server 4173 --bind 127.0.0.1` and visit http://127.0.0.1:4173.

## Structure

- `index.html`: complete page, responsive styles, example workflow tabs, accessible FAQ disclosures, and prototype dialogs.
- No build step, package dependencies, external fonts, analytics, or third-party assets.
- Workflow diagrams are illustrative. No invented clients or performance metrics are used.

## Before launch

1. Replace `[Company Name]`, the temporary brand mark, and page metadata with approved branding.
2. Replace booking dialogs with the real scheduling URL or implement and test a contact service.
3. Supply actual business contact details and reviewed privacy/terms pages appropriate to the final services used.
4. Confirm service descriptions and support commitments with the founders.
5. Add the final domain, social preview image, favicon, sitemap, and search metadata.
6. Check accessibility, mobile layouts, and the complete enquiry journey on the chosen host.

This is a local design prototype, not a published website. No booking is submitted and no personal information is collected. The single-file structure makes initial visual review easy; it can be split into reusable layouts and components as additional pages are added.

## Research behind the examples (15 October 2026)

These sources informed the choice of workflow patterns, not claims of our experience or results:

- Morningside, Asmuss case study: enquiry handling, CRM administration, workflow mapping, and prioritisation. Its savings are roadmap projections, not evidence of our own results: https://www.morningside.ai/case-study/building-new-zealands-first-ai-enabled-industrial-distributor
- Morningside, service process: discovery, implementation, and adoption: https://www.morningside.ai/services
- Neurastruct: document/quote processing, human review, and clearly scoped engagements. Its product, prices, timings, hosting, and ownership promises have not been adopted: https://neurastruct.com.au/
- Microsoft, document extraction: https://learn.microsoft.com/ai-builder/form-processing-model-in-flow
- Microsoft, approval workflows: https://learn.microsoft.com/en-us/power-automate/modern-approvals

The three interactive samples use fictional inputs and deterministic, pre-written outputs. Buttons simulate a review or exception-routing step locally; they do not call AI, send messages, post invoices, or connect to accounts. Reset and switching examples clear the simulation state.

The initial engagement is discovery-first, with a separately scoped pilot if suitable. There are no published price, duration, free-audit, or savings promises. Founders should confirm these proposed engagement terms before public launch.
