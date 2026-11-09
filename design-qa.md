# Design QA — website and revision history

The latest review is the "Paid-audit and technical-positioning revision" at the end of this document. Earlier comparisons are retained as history; the user has explicitly replaced the still-life direction.

Source visual truth: `/workspace/generated_images/exec-7f1a8c36-bc1e-497d-8070-7ff2672ad45d.png` (788 × 1997).

Implementation: local static site at port 4173. Initial browser-rendered capture: `/tmp/consulting-qa/desktop.png`, CSS viewport 1440 × 1000, device scale factor 1. The source is normalized to a 1440px-wide desktop design; comparison images reduce the implementation to 788px wide without changing aspect ratio. Evidence: `/tmp/consulting-qa/comparison-full.png` (source left, implementation right).

State: homepage, menu and dialogs closed, FAQ collapsed. The retained FAQ, service example links, and local enquiry brief are intentional functional extensions to the combined mockup.

## Initial findings

- P1, typography: the first render uses a smaller hero, section headings, and supporting copy than the target. Increase desktop typography and icon scale; preserve the tested mobile sizes.
- P2, About layout: the image is inset and too narrow, and the heading wraps to two lines rather than the target's three. Expand the image toward the left edge, increase the serif heading, and rebalance the columns.
- P2, capture: the focused hero screenshot was taken before scroll position had stabilized. Recapture after proving scroll position is zero, then repeat the focused comparison.

## Checks already completed

Headless Chromium rendered the implementation. Main actions, all three sample types, review/reset, tab keyboard navigation, Escape and focus restoration, local brief validation/preparation/edit/copy, policies, FAQ, and mobile navigation passed. No console errors or failed asset requests. No horizontal overflow at 1440, 1024, 768, 700, 390, or 320 CSS pixels.

## Required fidelity surfaces

- Fonts: locally served Inter for UI and Georgia for editorial headings; desktop scale needs correction above.
- Spacing: core hero matches the broad split composition; About proportions need correction above.
- Colors: forest, lime, paper, sage, and warm cream match the chosen direction; solid backgrounds intentionally replace generated texture.
- Images: generated still life matches the reference's subject and light; local WebP is 166 KB. Tabler icons replace the mockup's generic line icons without custom SVG drawings.
- Copy: no fictional credentials, founder identities, testimonials, prices, or measured outcomes. Workflow samples are labelled fictional. Contact actions explain their local-only behaviour.

## Implementation checklist

1. Correct desktop typography, icon scale, and About layout.
2. Recapture and inspect full-page and focused desktop comparisons together with the source.
3. Recheck responsive states and the changed paths.

## Comparison history and resolution

1. Initial full-view comparison: `/tmp/consulting-qa/comparison-full.png`. Desktop text was undersized, About imagery was inset, and the focused screenshot needed stable scrolling. Result: blocked.
2. Enlarged desktop text and icons, expanded the About image, and increased the serif heading. Evidence: `/tmp/consulting-qa/comparison-full-v2.png`. The hero then wrapped to four lines; the inherited desktop About padding also narrowed the mobile section. Result: blocked.
3. Restored the three-line hero with a measured 108px desktop heading and explicit responsive About containers. Stabilized scrolling before viewport captures. Final source/implementation comparisons were opened together and inspected:
   - Full view: `/tmp/consulting-qa/comparison-final-full.png`.
   - Focused hero: `/tmp/consulting-qa/comparison-final-hero.png`.
   - Focused About image, type and copy: `/tmp/consulting-qa/comparison-final-about.png`.
   - Responsive About: `/tmp/consulting-qa/about-mobile.png`.

Final implementation capture: `/tmp/consulting-qa/desktop.png` (1440 × 4644 physical pixels; viewport 1440 × 1000 CSS px; deviceScaleFactor 1). Source: 788 × 1997 physical pixels, interpreted as a desktop marketing composition. For the combined comparison, implementation is proportionally downsampled to 788px wide, not stretched to match the source height. Hero and About regions are additionally compared at equal widths. Overall height differs because the functioning page retains FAQ content, adds service example links and precise deliverable notes, and uses revised copy. These are intentional scope extensions, not density-normalization errors.

Mobile evidence: `/tmp/consulting-qa/mobile.png` (390 × 5927, viewport 390 × 900, density 1); `/tmp/consulting-qa/mobile-hero.png`; `/tmp/consulting-qa/about-mobile.png`. Tablet: `/tmp/consulting-qa/tablet.png` (768 CSS px wide). Dialog states: `/tmp/consulting-qa/example-desktop.png`, `/tmp/consulting-qa/example-mobile.png`, `/tmp/consulting-qa/contact-desktop.png`, `/tmp/consulting-qa/contact-mobile.png`.

## Final fidelity assessment

- Fonts/typography: local Inter provides a clear three-line desktop headline and consistent UI weight. Georgia supplies the warmer About and closing headings. Desktop and mobile wraps were inspected; no clipping remains. Exact generated letterforms are approximated with real, licensed typefaces.
- Spacing/layout rhythm: split hero, three-column services, sage process section, generous About split, and centered closing match the selected direction. Added functional content makes services/process longer than the concept. Mobile becomes one column with usable navigation and dialogs.
- Colors/tokens: forest, lime, paper, sage, and cream map to the visual target. Solid surfaces intentionally replace generated texture. Automated contrast checks found no violations in the tested states.
- Image quality: the generated still life reproduces the reference's subject, light, and palette; inspected both desktop crop and mobile image. The served WebP is sharp and approximately 166 KB. Icons are unmodified Tabler assets; the wordmark is text. No fabricated portraits, credentials, or client logos were added.
- Copy/content: headline and section hierarchy preserve the combined brief. About copy focuses on collaboration without inventing founder details. Samples remain fictional and deterministic. All primary CTAs reach a functional local brief composer; sending/booking is explicitly not connected.

## Final validation

- Functional smoke checks passed in Chromium: navigation, mobile menu, all three workflow examples, keyboard tab selection, simulate/reset states, dialog Escape/focus return, brief validation including whitespace-only input, preparation/editing/clipboard copy, FAQ, and policy dialogs.
- Responsive checks passed at 1440, 1024, 768, 700, 390 and 320 CSS px: no horizontal document overflow.
- No JavaScript console errors, failed asset requests, or external runtime requests during the smoke checks.
- Axe-core 4.10.3: zero violations for WCAG 2 A/AA and 2.1 AA rules across desktop home, example dialog, brief dialog, mobile home, and mobile menu. Automated checks do not establish full accessibility compliance; screen reader and real-device testing remain manual follow-ups.
- JavaScript syntax and Git whitespace checks passed. No build step exists or is required.

## Remaining launch inputs / follow-up polish

- Replace placeholder branding; supply actual founder names, photos, and relevant experience before adding biographies.
- Connect and test a real enquiry/booking destination, and replace preview policy text with reviewed business policies before publication.
- P3: a future branding pass can refine the wordmark and icon style. The generated concept's small decorative icon accents and connecting rules are intentionally omitted in favor of standard UI icons and accessible ordered steps.
- Local browser rendering was verified with the preinstalled headless Chromium. Opening the user's Codex panel is a separate UI action and does not prove that a visible preview appeared.

No actionable P0/P1/P2 visual findings remain for the selected combined direction.

## Self-contained preview correction

The user's file-visualization screenshot showed the modular HTML without its adjacent stylesheet and images. The served application was healthy; this was a separate file-preview transport problem.

Created `preview.html` with all CSS, JavaScript, fonts, icons, illustration, and asset licences embedded. `scripts/build-preview.mjs` regenerates it through an `apply_patch` patch. The original modular source remains editable.

Verified the generated HTML in an isolated Chromium document with networking disabled. No external stylesheets, missing images, network requests, or script errors; local fonts loaded. Example simulation, brief preparation, clipboard/fallback handling, and mobile navigation passed. Regeneration is deterministic and reports that the file is up to date.

Evidence: `/tmp/consulting-qa/standalone-desktop.png`, `/tmp/consulting-qa/standalone-hero.png`, and `/tmp/consulting-qa/standalone-mobile.png`. The desktop screenshot is pixel-identical to the tested served homepage (ImageMagick absolute error count: 0). Inspected the rendered standalone hero. The Codex file-panel opening request was queued; actual user-panel display is not independently observable here.

## Paid-audit and technical-positioning revision — 26 October 2026

### Current design truth and scope

User correction: replace the lifestyle still life with an AI/technology consulting visual and state that both audit/consulting and implementation incur fees. Preserve the selected green/lime page direction. A current screenshot of the earlier About section was supplied by the user; fresh pre-change captures were also taken.

Source for unchanged layout: the accepted combined design and current pre-change screenshots. Source for the new image: `assets/workflow-architecture.webp` (1254 × 1254), generated for this revision and inspected. New heading uses Inter rather than the former editorial serif, intentionally following the user's request for a more technical presentation.

### Evidence and normalization

- Before/after comparison opened together: `/workspace/reviews/ai-consulting-2026-10-26/about-comparison.png` (source left, revised implementation right).
- Focused original asset/render comparison opened together: `/workspace/reviews/ai-consulting-2026-10-26/architecture-asset-comparison.png`. Both sides are normalized to 720px width; a small containing margin is intentional to avoid clipping any diagram nodes.
- Desktop About: `/workspace/reviews/ai-consulting-2026-10-26/07-ours-after-about.png`, 1440 × 840 physical pixels.
- Desktop process: `/workspace/reviews/ai-consulting-2026-10-26/08-ours-after-process.png`, 1440 × 1087 physical pixels.
- Full desktop: `/tmp/consulting-competitor-audit/09-ours-after-desktop.png`, 1440 × 5066 physical pixels; viewport 1440 × 1000 CSS pixels, deviceScaleFactor 1.
- Mobile About and process: `/workspace/reviews/ai-consulting-2026-10-26/12-ours-mobile-about.png` and `12-ours-mobile-process.png`. CSS viewport 390 × 900; density 1. Full mobile screenshot is 390 × 6597.
- Paid enquiry and FAQ: `/workspace/reviews/ai-consulting-2026-10-26/10-ours-paid-enquiry.png` and `11-ours-paid-faq.png`.
- Offline preview: `/workspace/reviews/ai-consulting-2026-10-26/13-offline-preview-about.png`.

State: homepage with closed dialogs/FAQ unless named otherwise. The process is taller than before because the paid stages, deliverables and independent-audit note are now explicit. This is an intentional content change, not drift from the earlier mock.

### Findings and resolution

- P1, commercial clarity: the old "Understand" step did not state a fee before the subsequent paid build. Corrected with a paid consulting audit, separate paid implementation, deliverables, prior agreement of fees, and no obligation to purchase a build. The FAQ, enquiry dialog and service note now agree with that policy.
- P2, category positioning: the earlier plant/books photo communicated a lifestyle/editorial tone. Replaced with a technical architecture illustration and a plain sans-serif heading. The image is captioned and has descriptive alternative text; it is not presented as client evidence.
- Commercial copy was further tightened after inspection to avoid implying that integration feasibility work happens free before scoping. This assessment is explicitly part of the paid audit.
- Post-change captures were inspected on desktop and mobile, including a combined source/render asset comparison. No clipping, missing image content, or actionable P0/P1/P2 visual issue remains in the requested changes.

### Required fidelity surfaces

- Typography: consistent local Inter in the revised section; hierarchy and wrapping inspected at desktop and mobile widths. The serif remains in the closing statement as an unchanged design detail.
- Spacing: existing split structure retained; mobile stacks image then copy. Paid-stage labels and scope note remain readable without horizontal overflow.
- Colors: existing forest/lime/sage/cream tokens retained. Caption and paid-stage labels have clear contrast in automated checks.
- Asset fidelity: the exact new raster is embedded in its intended component and the standalone preview. `object-fit: contain` preserves all inputs/review/output nodes.
- Copy: both commercial stages say paid, client deliverables are concrete, and rollout/support remain defined by the agreed proposal. No actual fee amount, discount, free call or client result was invented.

### Validation outcome

The final Chromium run passed all workflow demos, simulate/reset, keyboard tab selection, brief validation/preparation/edit/copy and mobile-menu navigation. No script errors, failed assets, or external runtime requests were observed. No overflow at 1440, 1024, 768, 700, 390 or 320 CSS px. The regenerated standalone preview passed with networking disabled and the new illustration loaded.

Axe-core 4.10.3 returned zero WCAG 2 A/AA and 2.1 AA rule violations in desktop home (21 passing checks), paid enquiry dialog (16), example dialog (18), and mobile menu (21). This is not a full accessibility certification.

The six-site comparison and accepted current screenshot evidence are in `competitor-review.md`. Remaining launch gaps—placeholder company identity, founder credentials, actual client evidence and a connected contact destination—are openly recorded, not hidden by a prototype QA pass. No publication or Git push has occurred.

## Canonical entry-file repair and project memory — 26 October 2026

The user reported the unstyled page again. The previous repair generated a standalone `preview.html` but left the canonical `index.html` dependent on adjacent files. That did not cover the document the user could reopen in the file visualization panel.

Corrected the packaging contract:

- Moved the editable HTML template to `app.html`, preserving its content.
- Both `index.html` and `preview.html` are now generated, byte-identical self-contained documents, with embedded styles, scripts, fonts, icons, favicon and the technical illustration.
- `scripts/build-preview.mjs --apply` updates both through `apply_patch` and is safe to rerun. `--check` rejects stale or non-standalone entry files.
- Added four Node regression tests, including rejection of relative resources with double-quoted, single-quoted and unquoted attributes.
- Added `scripts/check-preview.cjs` to render the actual `index.html` contents in an isolated page with networking disabled, no file-directory base, and no server fallback.
- Saved project-scoped memory and mandatory handoff rules in `AGENTS.md`, including the user's paid-audit policy and rejection of lifestyle imagery.

Verification: all four Node tests passed, with no skips. The canonical index browser check passed: embedded fonts/styles loaded, zero missing images, zero console errors and zero external requests. Workflow simulation, brief preparation and copy/fallback, mobile navigation and widths 1440/768/390/320 were checked. The generator's already-current `--apply` path was also exercised successfully.

Rendered evidence is retained under `/workspace/reviews/ai-consulting-preview/`: `index-desktop.png`, `index-hero.png`, `index-mobile.png`, `index-mobile-hero.png`, and `index-about.png`. Desktop and mobile hero captures were opened and inspected. The visual design and paid-engagement copy are unchanged by this packaging repair.

Actual in-app panel display remains a separate, unobservable client state; no queued tool result is being treated as proof that the panel displayed correctly. The delivered file itself was verified without network or neighboring resources.

final result: passed
