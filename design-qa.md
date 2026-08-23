# Design QA — 每日古诗文 / 枫桥夜泊

## Comparison target

- Source visual truth: `/Users/luoyiti/.codex/generated_images/01a02d9a-e06d-75b0-ab6f-48abe2a4eae6/exec-e2faa1bc-3486-463b-85ee-b077d7b0e0af.png`
- Browser-rendered implementation: `/Users/luoyiti/Project/VibeCoding/poetry/implementation-maple-final-normalized.png`
- Full-view comparison: `/Users/luoyiti/Project/VibeCoding/poetry/design-qa-comparison-final.png`
- Focused reading-region comparison: `/Users/luoyiti/Project/VibeCoding/poetry/design-qa-comparison-main-final.png`
- Responsive evidence: `/Users/luoyiti/Project/VibeCoding/poetry/implementation-maple-mobile.png`
- State: default daily poem, second verse selected with annotation visible.

## Viewport and normalization

- Source pixels: 1487 × 1058, generated at the intended 1440 × 1024 desktop ratio.
- Source normalization: resized to 1440 × 1024 for direct comparison, without crop.
- Implementation pixels: 1440 × 1024.
- CSS viewport: 1440 × 1024; device scale factor 1.
- Responsive check: 390 × 844; document width remained 390 px with no horizontal overflow.

## Findings

No actionable P0, P1, or P2 mismatches remain.

- Fonts and typography: bundled Noto Serif SC and Noto Sans SC preserve the source's literary serif hierarchy and readable small utility text. The title, four verses, metadata, note, and rail labels keep the intended optical weights and line lengths.
- Spacing and layout rhythm: title and verse left edges, four-line vertical rhythm, cabin split, full-height rail, and annotation offset align closely with the source after the first correction pass. All persistent controls remain within the viewport.
- Colors and visual tokens: blue-black water, ivory verse text, amber selected state, and warm cabin rail match the source balance with sufficient contrast.
- Image quality and asset fidelity: the full-bleed image is a dedicated generated asset matching the source's river, pagoda, maple branch, rain window, and lantern. No CSS/SVG substitute art is used.
- Copy and content: poem title, author, dynasty, all four lines, annotation, translation, appreciation, recitation, dictation, and history labels are coherent and accurate.
- Icons and affordances: Phosphor icons are used consistently for history, bell, audio, close, completion, and navigation actions.
- Accessibility and resilience: semantic headings/buttons, visible keyboard focus, reduced-motion support, inert off-screen layers, Escape dismissal, and mobile layout were checked. Text does not clip or overflow at 1440 × 1024 or 390 × 844.

## Full-view comparison evidence

The final side-by-side composite shows equivalent page-scale composition: the dark river occupies the reading field, the cabin and lantern form the right architectural plane, the title sits above four horizontally paced lines, and the learning rail stays at the far right. The implementation intentionally uses selectable HTML text and a real generated scene asset instead of baking UI into the image.

## Focused region evidence

The reading-region composite confirms the title/metadata hierarchy, selected amber second line, annotation placement, four-line rhythm, underline treatment, and primary dictation action. This focused crop was needed because utility copy and verse weight were too small to judge reliably in the full-view image.

## Comparison history

### Pass 1 — blocked

- [P2] Verse rhythm was too compressed: the implementation placed the four lines roughly 90 px apart while the source used a much slower, approximately 130–140 px cadence.
- [P2] Verse block began too far left and the primary action was undersized, weakening the source's editorial hierarchy.
- Fixes: increased desktop verse gap to 6.8vh, offset the verse block by 3vw, increased display type to a 50 px ceiling, moved the marginal note to preserve its left alignment, and enlarged the dictation action.
- Post-fix evidence: `/Users/luoyiti/Project/VibeCoding/poetry/design-qa-comparison-v1.png` and `/Users/luoyiti/Project/VibeCoding/poetry/design-qa-comparison-main-v1.png` show the corrected cadence and alignment.

### Pass 2 — passed

- Re-captured after interaction/accessibility corrections and compared at the same 1440 × 1024 state.
- No new P0/P1/P2 findings. Browser console contained no warnings or errors.
- Primary interactions tested: verse annotation switching, translation, recitation hide/reveal, complete dictation with four inputs, history drawer, and selection of all three poem pages.

## Follow-up polish

- [P3] The source uses a more organic brush-edged dictation control. The implementation keeps a cleaner rectangular control so the visible asset is not imitated with prohibited CSS/SVG art; a future pass could replace it with a dedicated raster texture.

## Implementation checklist

- [x] Source and implementation opened and compared together.
- [x] P2 layout findings corrected and re-captured.
- [x] Desktop and mobile viewports checked.
- [x] Primary learning and history interactions tested.
- [x] Browser console checked.
- [x] Production build and Sites worker tests passed.

final result: passed
