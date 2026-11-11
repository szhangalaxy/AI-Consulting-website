# Design QA — website and revision history

The latest review is the [pre-merge QA report dated 12 November 2026](release-qa-2026-11-12.md), with fresh screenshot evidence committed under `qa/2026-11-12/`. The promotion and design comparisons below remain historical records; the user has explicitly replaced the still-life direction.

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

## Noviqa shortlisted logo comparison, 11 November 2026

Scope: polish and test both user-selected graphic identities in a separate self-contained homepage testbed. Not a final identity selection, promotion to the main site, launch, GitHub push, enquiry integration or legal clearance. `index.html`, `preview.html`, `workflow-demo.html` and their authoring sources remain unchanged.

### Source visual truth and implementation

- Selected Current concept: `/workspace/generated_images/exec-e56a7a18-a97b-45c7-aecd-985393651985.png` (1536 × 1024 concept board).
- Selected Converge concept: `/workspace/generated_images/exec-f503d347-1962-40f8-b1e7-93b90325ccb2.png` (1536 × 1024 concept board).
- Refined visual assets used directly: `assets/brand/current-lockup.png` and `converge-lockup.png` (2172 × 724); `current-symbol.png` and `converge-symbol.png` (1254 × 1254). Both refined lockups were shown before implementation. Concept boards are not full website layout specifications; the unchanged richer-demo homepage is the site-layout baseline.
- Implementation: `logo-comparison.html`, served locally at port 4173 and independently tested as isolated HTML with networking disabled. The comparison defaults to Current and switches all brand placements to Converge without navigation or state persistence.
- Evidence directory: `/workspace/reviews/noviqa-logo-polish-2026-11-11/`.

### Combined comparisons and normalization

- Full-view combined input, opened and inspected: `qa-full-comparison.png` (1440 × 760), containing baseline, Current and Converge. Each original capture is 1440 × 1000 physical/CSS pixels at deviceScaleFactor 1 and is uniformly displayed at 456px wide in the comparison. The review-only toolbar is hidden for these alignment captures, not removed from the delivered comparison.
- Focused combined input, opened and inspected: `qa-focused-comparison.png` (1000 × 650). Expected source lockups and actual header-element captures are displayed together at the same 196 × 49 CSS/physical size, density 1. Source transparent margins are display-cropped with the same documented alpha bounds, without modifying image pixels. This checks that the generated image is faithfully placed, not redrawn, stretched or reconstructed from UI text.
- Actual review UI captures inspected: `current-1440-hero.png`, `converge-1440-hero.png`, `current-390-hero.png`, `converge-390-hero.png`, both 320px hero captures, both `*-footer.png` and both `*-specimens.png`. Hero captures are viewport screenshots, not device-chrome mockups. Specimens show real 16/24/32/48px images on paper and reversed on forest, not enlarged images falsely labelled as small icons.
- `served-converge-desktop.png` additionally proves the HTTP-served page rendered and switched in Chromium. This does not establish the user's in-app file panel is displaying successfully.

### Findings, fixes and comparison history

1. Initial working browser pass: the 320px review-only toolbar wrapped its explanation and size-test link into extra rows. It consumed 176px before the site header. [P2, review controls/layout] Evidence retained as `current-320-before-toolbar-fix.png` and `converge-320-before-toolbar-fix.png`. Result: blocked for that review-layout issue.
2. Hid the nonessential safety suffix on mobile and shortened the size-study link to "Icon sizes". The toolbar now fits in two compact rows at 320px, about 102px high. Recaptured both 320px states and rechecked all widths. [Resolved] No overlap or horizontal overflow; both switches remain at least 44px tall. Focused/full comparisons and mobile screenshots were inspected after this fix.
3. Removed repeated embedded PNG copies from non-header placements, reusing the inline asset registry after initialization. Standalone file reduced from approximately 9.6MB to 3.8MB without changing raster files or adding requests. Reran packaging, browser and visual checks. Header has an immediate Current image; switching and the other studies require scripts, as explicitly noted in the noscript notice.
4. Final visual comparison: both identities fit at unchanged header height, align with existing navigation, leave the hero/content layout intact, and remain readable at mobile header size. Reversed samples have clean transparent edges; small symbols retain their broad identifying structure. No actionable P0/P1/P2 findings remain within this prototype-comparison scope.

### Required fidelity surfaces

- Fonts/typography: site Inter and all content sizes/wrapping remain unchanged. The refined lowercase wordmarks stay inside the generated image assets, with clear q descenders and open counters; no substituted font pretends to be the generated lettering. Header image viewport is 196 × 49 desktop, 176 × 44 tablet, and 172 × 43 mobile, with an enclosing home target at least 48px high.
- Spacing/layout rhythm: shared hero, grid, navigation and footer rules are preserved. Transparent raster padding is optically cropped consistently. Full-view comparison shows only the intended identity replacement, plus the review toolbar/study section in normal review mode. Both wordmarks clear the 44px mobile menu target at 320px and above.
- Colours/tokens: forest/paper/lime/sage site tokens are unchanged. Generated dark-green raster pigments vary slightly from exact forest; this is disclosed, not claimed to be colour-certified vector art. Reversed studies filter the same images to solid white on forest. Exact-colour brand masters remain future production work.
- Image quality/asset fidelity: all four transparent PNGs are actual generated assets. No handcrafted SVG, div art, CSS-drawn brand shape or text recreation replaces them. No clipping or opaque background rectangle is visible in the compared placements. Symbols are also tested using the original padded square canvases, so 16px studies include their real safety margins. These are raster prototypes; a vector master and optical favicon treatment remain advisable.
- Copy/content: business name changed to the user-approved Noviqa only in this testbed. Service wording, fees/scope boundaries, fictional examples, technical illustration and honest local-only contact notice remain unchanged. No new claims, founder identities or contact endpoint were invented.

### Verification and limits

- Twelve Node tests passed across main packaging, richer-demo packaging and the new comparison. The new tests confirm all three existing delivered HTML files still equal their original generators.
- Both identities tested offline at 1440, 1024, 900, 768, 700, 390 and 320px. No document overflow, broken images, external requests or browser errors. `checks.json` records measured logo and tap-target bounds.
- All six richer workflow scenarios exercised under each identity (12 combinations), including result/reset and Escape focus return. Keyboard Enter/Tab/Space switch controls, selected state, live announcement and visible focus passed. Mobile navigation, local brief preparation, policy dialog and FAQ disclosure passed.
- Existing index and richer-demo isolated browser checks passed independently. Existing polish check passed all 12 mobile workflow cases and desktop alignment.
- Local HTTP-served rendering and identity switching passed. Preview server remains available at port 4173 for this session; no public deployment occurred.
- This is bounded browser/visual QA, not full accessibility certification. No new axe result is claimed; the optional helper is unavailable. Real-device/browser-chrome favicon rendering, screen-reader review, vector geometry/type licensing, and trademark/similarity clearance remain unverified follow-ups.

### Implementation checklist and follow-up polish

- [x] Resolve the exact two selected concepts, refine and show them, then reuse real generated assets.
- [x] Build one self-contained reversible comparison without changing the main site.
- [x] Test desktop/mobile headers, footer, reversed variants, small-size studies and primary interactions.
- [x] Fix the narrow toolbar issue and recapture combined visual evidence.
- [ ] User chooses the final identity before promotion or publication.
- [ ] Produce editable, exact-colour vector masters and optically tuned icon derivatives; clear the identity legally before launch.

final result: passed

## Converge selected identity rollout, 11 November 2026

The user selected Converge after the website comparison. Applied that exact design to the real header, footer and browser icon, with Noviqa in the title, home-link labels and copyright. Updated the shared source and regenerated `index.html`, identical `preview.html`, the richer `workflow-demo.html`, and the separate comparison. Did not promote the richer demo over index, add comparison controls to the main site, alter service copy, connect enquiry delivery, commit, push or deploy.

### Source and combined visual evidence

- Source visual truth: the user-tested Converge state of `logo-comparison.html`, using `assets/brand/converge-lockup.png` (2172 × 724 RGBA) and `converge-symbol.png` (1254 × 1254 RGBA). The existing selected artwork was opened and reused, not regenerated or redrawn.
- Fresh evidence: `/workspace/reviews/noviqa-converge-selected-2026-11-11/`.
- `source-converge-1440.png`, `index-1440.png`, `workflow-demo-1440.png`: matching 1440 × 1000 CSS/physical pixels, density 1; dialogs/menu closed, top of page. The source comparison's review-only toolbar is hidden for viewport alignment. Canonical index intentionally keeps its existing "Explore an example" action while the richer variant keeps "Try a workflow".
- Combined full-view comparison opened and inspected: `qa-full-comparison.png` (1440 × 760), source/main/richer captures shown together at a uniform 456px width, without distorting aspect ratios.
- Combined focused comparison opened and inspected: `qa-focused-comparison.png` (1000 × 700), matching source/main/richer header crops displayed together at native CSS/pixel size. Desktop crop is 196 × 49; mobile is 172 × 43 at both 390px and 320px viewports. The tested transparent-margin display crop is preserved exactly; raster pixels are unmodified.
- Mobile `index-390.png` and desktop `index-footer.png` were also opened and inspected. `index-footer-mobile.png`, all three viewport captures for index/richer, and `checks.json` retain additional evidence.

### Findings and required fidelity surfaces

- No actionable P0/P1/P2 visual mismatches in the selected scope. Converge's four mirrored modules, open channels, wordmark proportions and q descender match the selected comparison. Header/footers are readable and do not collide with navigation or the mobile menu.
- Fonts/typography: the generated wordmark remains in the original image, not replaced by an approximate font. Site Inter, body/headline sizes, wrapping and supporting text remain unchanged. Home links have a 48px minimum target height. There is no new font dependency.
- Spacing/layout rhythm: header heights and navigation positions are preserved. The shared brand image viewport uses the tested 196/176/172px responsive widths with a 4:1 display frame. Full comparison shows the same hero layout; no review toolbar or size-test section leaks into index or the richer entry.
- Colours/tokens: forest/paper/lime tokens are unchanged. Existing generated dark-green raster pigments are retained. Exact-colour vector production is still a separate follow-up, not claimed completed.
- Image quality/fidelity: header and footer embed the exact approved transparent lockup; favicon embeds the approved standalone symbol as PNG. The asset is not replaced with inline SVG, CSS art, div drawings or text. No clipping, opaque background rectangle, broken image or missing stylesheet was seen. Brand presentation does not require scripts.
- Copy/content: placeholder company names are replaced by the user-approved Noviqa. Auditing/build scope, fees, examples, human-review language, technical illustration and local-only contact boundary are unchanged. No unapproved claims or contact service were added.

### Validation and comparison history

- Thirteen Node tests passed, including exact Converge lockup embedding twice, exact PNG favicon, name/title, no main-site comparison controls, all packaging contracts and prior content rules.
- `scripts/check-brand.cjs`: 42 isolated offline cases passed, spanning three entry files × scripts enabled/disabled × seven widths (1440, 1024, 900, 768, 700, 390, 320). No overflow, logo/menu collision, broken brand image, external request or console/page error. Accessible home links and image sources match the selected assets. `index.html` and `preview.html` remain byte-identical and self-contained.
- Existing index interaction check, all six richer scenarios, all twelve mobile polish cases and the separate two-logo comparison checks passed. Menu, tabs, focus, dialogs, local brief and policies remain functional within their existing prototype boundaries.
- The new test harness initially reused one window for multiple `setContent` documents, which retains top-level lexical declarations and produced false redeclaration errors. Corrected the harness to use a fresh page per entry, reran all 42 cases and recaptured the evidence. No application-code workaround was needed. This was a harness correction, not a visual-QA iteration.
- The first accepted post-rollout visual comparison found no actionable P0/P1/P2 difference and required no visual fixes. Final result is passed for this selected-brand rollout, not for an entire production launch.

### Implementation checklist and remaining limits

- [x] Apply the exact selected Converge artwork to header, footer and favicon in all generated entry files.
- [x] Remove company placeholders, preserve page content and refresh the comparison's integration with branded sources.
- [x] Check standalone/offline branding with and without scripts, responsive layouts and existing interactions.
- [x] Inspect combined source/implementation comparisons and save the selected identity in project memory.
- [ ] Final editable vector masters, type licensing and trademark/similarity clearance remain outstanding.
- [ ] Real-device/browser-chrome favicon, manual screen-reader and full accessibility validation remain separate checks; no new axe certification is claimed.
- [ ] Real enquiry delivery still needs the user's form endpoint and a live end-to-end delivery test. This branding change does not configure hosting or send email.

final result: passed

## Richer workflows promoted to the default website, 12 November 2026

The user agreed to make the richer workflow version the default and retain the simpler site as an archive. This supersedes the earlier rule keeping the richer explorer separate from index. No new visual design, workflow data, business claim or external service was introduced.

### Preservation and build contract

- Created `archive/simple-workflows-2026-11-12.html` before changing the build. It exactly matched the pre-promotion `index.html`: 2,266,040 bytes, SHA-256 `540c827418d2632d65397e2ec2500324050d748c8c66f7f9269dbecbf876ad29`. A regression test pins these bytes; no generator targets the archive.
- Before overwriting any entry, a strict equality check proved the new canonical output matched the previous richer `workflow-demo.html` after normalizing only its old demo-title prefix and generation marker. The final generation comment additionally names the live workflow sources and canonical build command. The website markup, scripts, assets and styling are otherwise the approved richer version.
- `scripts/build-preview.mjs` now composes the richer explorer in its public `buildDocument()` API and writes `index.html`, `preview.html` and `workflow-demo.html` together. All three are byte-identical self-contained current entries. `scripts/build-workflow-demo.mjs` delegates to this build, including its existing CLI, so either build command cannot accidentally restore the simpler index.
- The existing separate logo comparison still builds correctly and remains a reference page, not the default website. Converge is unchanged in all main entries.
- Updated README, project memory and workflow-source instructions to distinguish current entries, authoring files, the reference comparison and the frozen archive. Older simple sample definitions remain internal base/fallback code, not an alternative public build output.

### Verification

- Fifteen Node tests passed, covering all-entry equality, full richer workflow inclusion, source-link/reporting wording, Converge embedding, preserved content, removal of the progress strip, single initialization, self-contained resources, compatibility build API and exact archive preservation.
- Full isolated/offline browser checks passed against each actual entry: `index.html`, `preview.html` and `workflow-demo.html`. Each exercised all six scenarios, source highlighting, results/reset, tabs/keyboard/Escape/focus, mobile controls, contact brief and policy actions across 1440/1024/768/700/390/320px. No browser errors or external resource requests.
- The main index smoke check passed independently: fonts/styles and embedded images loaded, workflow action worked, and brief/copy/menu behavior remained local and functional.
- Mobile polish check passed all 12 scenario/short-screen cases; desktop links and deliverables aligned. Approach labels/deliverables remained 14/14/16px at all tested widths.
- The separate logo-comparison browser suite passed after the build migration. Re-running both build commands is idempotent and leaves all current entries identical. `git diff --check` passed.

### Visual evidence inspected

- `/workspace/reviews/ai-consulting-preview/index-hero.png`: actual canonical index with Converge and "Try a workflow".
- `/workspace/reviews/canonical-workflows/index/documents-exception-result.png`: richer invoice exception path in the actual index, including source highlighting, review hold and no progress strip.
- `/workspace/reviews/canonical-workflows/index/mobile-reports-review.png`: mobile prepared-first report view, legible fields and persistent review action.
- Matching full-suite captures/results are under `/workspace/reviews/canonical-workflows/index/`, `preview/` and `workflow-demo/`. Screenshots were opened and inspected. No visual changes from the previously approved richer version were needed.

### Remaining limits

No commit, GitHub push, public deployment or enquiry integration occurred. Enquiry delivery still awaits configuration. Optional axe tooling is unavailable; no new accessibility certification is claimed. In-app file-panel availability remains separate from the successfully tested self-contained HTML.

final result: passed
