# Design QA — 每日古诗文 / 咸阳值雨

## Visual brief

- 时间与地点：唐代咸阳桥畔的清晨，桥、渭水与远处钓船被一场密雨拉开层次。
- 天气与色温：雨脚密集，冷蓝灰为主，天际保留少量清晨暖光。
- 材质与意象：湿木桥面、银灰水面、薄雾、细密雨线与一叶钓船。
- 构图：桥体由左侧斜入画面，阅读区沿水面展开；四个编号雨点控制诗句层次，底部学习工具栏承接译文、赏析、背诵、默写与历史入口。该构图、阅读顺序与交互层级均不同于既有三篇。

## Comparison target

- Source visual concept: `/workspace/scratch/78d982c0f7ed/generated_images/exec-02617a99-c906-4e92-9542-5e7d4ed8c026.png`
- Production image asset: `public/assets/poems/xianyang-rain.webp` (1487 × 1058 WebP)
- Desktop evidence: `/tmp/everydaypoem-qa/xianyang-rain-desktop.png`
- Mobile evidence: `/tmp/everydaypoem-qa/xianyang-rain-mobile.png`
- Browser runner: Playwright fallback, used because the configured cloud-browser runtime was unavailable in this workspace. QA evidence stays outside the repository.

## Viewports and interaction coverage

- Desktop: 1440 × 1024; image loaded; document width matched viewport; no console errors or page errors.
- Mobile: 390 × 844; background crop remained proportional; document width matched viewport; no text or control clipping; no console errors or page errors.
- Tested all four rain-layer verse selectors and their annotations; translation and appreciation panels; recitation hide/reveal; four-line dictation to success; four-item history drawer and close action.

## Fidelity ledger

- Copy: title, dynasty, author and all four lines match the selected text; the above-fold reading view introduces no unapproved weather facts, badges or secondary labels.
- Spatial rhythm: the left bridge mass, open water reading field, distant boat and bottom study rail preserve the visual brief without repeating the layouts of the other poems.
- Typography: literary serif display type carries the title and active verse; compact sans-serif navigation keeps the learning controls legible against the image.
- Palette and asset treatment: cool blue-gray rain and water dominate, balanced by a restrained dawn highlight; the background is a dedicated generated raster asset, not CSS or SVG substitute art.
- Responsive behavior: desktop uses vertical numbered rain marks; mobile converts them into a compact horizontal sequence and shortens the active reading block without hiding core controls.
- Interaction and accessibility: active-state labels, semantic buttons, visible focus, reduced-motion handling, overlay dismissal and keyboard-friendly inputs are present.

## Findings and verification

No actionable P0, P1 or P2 mismatches remain. Showing one active line at a time, rather than rendering all lines faintly as in the concept, is an intentional implementation decision: it keeps the rain-layer interaction readable on the 390 px viewport while retaining direct access to every line.

- `npm run check:library`: passed; 60 junior-high + 72 senior-high = 132 exclusions, 5 matcher checks passed.
- `npm run build`: passed; Vite production bundle and hosting resources generated.
- `npm run test:sites`: passed; 4 tests passed, 0 failed.
- `node --test tests/daily-poem-content.test.mjs`: passed; daily selection, exact text, notes, appreciation length, distinct layout and image asset verified.

final result: passed

---

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

---

# Design QA — 每日古诗文 / 兰溪棹歌

## Visual brief

- 时间与地点：春夜兰溪；雨后水涨，眉月低悬柳湾。
- 天气与色温：连日春雨之后的清凉夜色，以冷青蓝为主，舟灯只作为极小暖点。
- 材质与意象：镜面水光、远山薄雾、湿岸、木舟、月色与浅滩水纹。
- 视觉命题：静止的水镜被半夜上滩的鲤鱼打破。页面以四条横向“水镜线”逐句展开，末句收束到近滩动势；不同于已有雨幕分层、舱窗、雪纸长卷与晨窗构图。

## Verification scope

- Dedicated generated raster asset: `public/assets/poems/lanxi-moon.webp` (720 × 532 WebP), derived from the ImageGen-created clean scenery region and containing no baked poem text or UI.
- Desktop target: 1440 × 1024. Mobile target: 390 × 844.
- Core controls implemented: four verse selectors/annotations, translation, appreciation, recitation, dictation and history entry.
- Mobile CSS keeps all five learning controls fixed and available, moves long detail copy above the tool rail, and allows the reading region to scroll vertically without horizontal overflow.
- Reduced-motion behavior continues to inherit the global repository rule.

## Local environment result

- `npm run bootstrap`: exit 20 with `DEPENDENCY_NETWORK_UNAVAILABLE`; local npm registry DNS is unavailable, so local Vite build/browser execution is not claimed.
- `npm run verify:offline`: passed in the clean network-independent validation workspace; 132 curriculum identities checked and 2 daily-content tests passed.
- Final production build, static title, route behavior and asset availability must be verified by the Vercel deployment for the single content commit before this QA is considered production-passed.

final result: pending remote build gate
