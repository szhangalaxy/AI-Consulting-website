# Website QA and competitor comparison

Reviewed 26 October 2026 (Australia/Sydney). Scope: the supplied competitor pages and the local AI consulting website, from first impression through service understanding, engagement terms and enquiry. This is a website experience comparison, not a verification of the competitors' business performance.

## Verdict

The site explains practical automation through concrete examples and a readable page structure. The two requested corrections were justified: the still-life image weakened the technology positioning, and the original process did not say that the assessment itself was paid.

Both are corrected. The larger remaining launch gaps are real business/founder identity, credible evidence of relevant work, and an actual contact or booking destination. Better imagery cannot substitute for those.

## Comparison with the six references

| Reference and inspected surface | What helps a prospective client | Implication for this website |
| --- | --- | --- |
| [Fathom — About](https://www.fathomdigital.com.au/about) | Named founder, visible portrait, relevant engineering experience and a coherent explanation of AI augmentation. | Our technical visual now fits the category, but the page still lacks real people and qualifications. Add supplied founder information, not an invented biography. |
| [Aperture — Services](https://get-aperture.ai/services.html) | Everyday problems, possible starting projects and explicit commercial options. The captured section lists an AI Sprint from $8k, a Build Partnership from $12k/month and Managed AI & IT from $4k/month. | Keep plain-language examples and make engagement boundaries concrete. Our audit and build are now explicitly paid and separate. We have not copied competitors' pricing or sprint durations. |
| [Kindred — process](https://kindredconsulting.au/) | Distinguishes discovery, options/business case, proposal, delivery and outcomes. Its proposal stage describes deliverables, milestones and a fixed fee. | State what the client receives, and when they agree scope and fees. Do not infer from this page that Kindred charges separately for every preliminary discussion. Our own paid-audit policy is stated directly. |
| [Brightward — current landing page](https://brightward.com/#how-an-engagement-runs) | Short positioning and a visible email destination make the next step straightforward. The supplied engagement fragment is not present on the current page. | Our services and examples provide more detail, but Brightward exposes a real contact address while ours is still a local brief preview. That is a launch gap, not a reason to remove the demos. |
| [Neurastruct — homepage and cost FAQ](https://neurastruct.com.au/) | Technical subject matter, product context, explicit scope/ownership language and a cost FAQ. The opened FAQ distinguishes paid Discover work from its advertised free consultation, with Discover fees credited to Build. | Distinguish an enquiry from substantive assessment work. Our audit is a paid standalone deliverable, with no obligation to buy implementation. We have not adopted Neurastruct's free call, fee credit, hosting or ownership promises. |
| [Morningside — homepage](https://www.morningside.ai/) | Identify/Develop/Adopt tells a clear delivery story. Visible client logos and named testimonials offer evidence a visitor can investigate. | Retain the explanation of what happens after a build. Add genuine case evidence when available; interactive fictional samples help understanding but are not client results. |

Competitors' prices and experience statements above are claims observed on their own sites, not independently verified facts or recommendations for our pricing.

## Our visitor journey: findings and health

| Step | Surface / visitor question | Current health | Finding |
| --- | --- | --- | --- |
| 1 | Introduction and service examples: what do you do? | Good prototype; identity incomplete | Hero copy now covers finding AI opportunities as well as building automation. The three examples remain labelled illustrative. Placeholder company branding and lack of founder detail remain launch issues. |
| 2 | Our approach: what am I buying? | Corrected | Stage 1 is labelled Paid AI audit & consulting. Stage 2 is labelled Paid implementation. Scope, deliverables and fees are agreed before each begins. The audit can be used independently. |
| 3 | Technical positioning: why this approach? | Corrected | Replaced the plant/books still life with an illustrated workflow architecture and a clearer sans-serif heading. The caption and alternative text identify it as illustrative, not a deployed client system. |
| 4 | FAQ and enquiry: what happens next? | Working preview; not launch-ready | Fees are explained consistently in the process, FAQ and enquiry dialog. Visitors can prepare/edit/copy a brief locally, but no enquiry is submitted and there is no connected booking service. |

### Corrections made

- Replaced the lifestyle visual with the generated `workflow-architecture.webp`; retained the earlier unused asset for recoverability.
- Updated the About section to explain audit-led technical decisions, including where AI does not fit.
- Made paid audit/consulting and paid implementation distinct, with tangible deliverables and agreed fees before work begins.
- Clarified that handover, training, rollout and ongoing support are defined in the build scope.
- Updated the FAQ, service note, enquiry preview, metadata and README to avoid conflicting free-discovery implications.
- Regenerated `preview.html` so the isolated file viewer receives the same current content and embedded assets.

### Remaining priorities before launch

1. Supply the company identity and real founder experience/photos. Fathom demonstrates why this matters for trust.
2. Connect a real contact or booking route and test delivery. The current brief tool is explicitly a preview.
3. Add approved evidence of work as it becomes available. Keep fictional demos separate from customer results.
4. Confirm the actual audit deliverables and commercial proposal wording. Exact price ranges can be added once approved; none have been invented.

## Functional and accessibility checks

- Chromium smoke checks passed for all three examples, review/reset, keyboard tab selection, dialog Escape, brief validation/preparation/edit/copy and mobile menu navigation.
- No horizontal overflow at 1440, 1024, 768, 700, 390 or 320 CSS pixels.
- No script errors, failed assets or external runtime requests during the local checks.
- Axe-core 4.10.3 found zero violations for its WCAG 2 A/AA and 2.1 AA rules in the desktop homepage, paid enquiry dialog, example dialog and mobile menu states.
- The self-contained preview passed with networking disabled, including embedded image/font loading and the paid-engagement message.

These are bounded automated checks, not a full accessibility certification. Competitor keyboard behavior, mobile layouts, assistive-technology support, performance scores and enquiry delivery were not audited. No competitor forms were submitted.

## Screenshot evidence

All screenshots below were captured and inspected in this review. Originals and focused captures are retained at `/workspace/reviews/ai-consulting-2026-10-26/`.

### Fathom: founder credibility

![Fathom About page showing its founder and philosophy](/workspace/reviews/ai-consulting-2026-10-26/01-fathom-hero.png)

### Aperture: explicit commercial offer

![Aperture service engagement options and starting prices](/workspace/reviews/ai-consulting-2026-10-26/02-aperture-engagement.png)

### Kindred: scoping through outcomes

![Kindred process section showing proposal and delivery stages](/workspace/reviews/ai-consulting-2026-10-26/03-kindred-engagement.png)

### Brightward: brief positioning and direct contact

![Brightward landing page and visible contact email](/workspace/reviews/ai-consulting-2026-10-26/04-brightward-hero.png)

### Neurastruct: separation of discovery fees

![Neurastruct cost FAQ expanded with discovery and build pricing](/workspace/reviews/ai-consulting-2026-10-26/05-neurastruct-fees.png)

### Morningside: category positioning and visible client references

![Morningside homepage with its delivery message and client logos](/workspace/reviews/ai-consulting-2026-10-26/06-morningside-hero.png)

### Our corrected approach

![Our paid AI audit and separate paid implementation stages](/workspace/reviews/ai-consulting-2026-10-26/08-ours-after-process.png)

### Our replacement technical visual

![Our technical architecture illustration and audit-led About copy](/workspace/reviews/ai-consulting-2026-10-26/07-ours-after-about.png)

### Our mobile layout

![Technical About section at 390 CSS pixels wide](/workspace/reviews/ai-consulting-2026-10-26/12-ours-mobile-about.png)

## Capture limits

Remote responses were fetched through the environment proxy with HTTPS verification enabled, then rendered in Chromium. No certificate checks were disabled and no persistent certificate trust changes were made. Non-GET/HEAD requests were not forwarded. Initial animation/loading captures were rejected; the accepted Kindred evidence uses the settled process section. Small glyph fallbacks seen in Aperture's capture are not classified as confirmed defects on its production site.

The Fathom link is an About page and the Aperture link is a Services page, while the others are homepages; this is a comparison of useful experience patterns, not an equal-scope numeric ranking.
