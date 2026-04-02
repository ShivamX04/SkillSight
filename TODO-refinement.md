# Sidebar Refinement Plan

**Current State Analysis:**
- Layout: Flex (to change → Grid 300px 1fr)
- Sidebar width: 260px → 300px (min 280px)
- Cards: Padding 12px 14px (good), no margin-bottom/gap control
- Typography: h3 0.9rem → 14-15px, add line-clamp 2 lines
- Match score: Badge padding 2px 6px (shrink), softer colors
- Scroll/hover: Good (refine transition to 0.2s ease)
- Responsive: Good (ensure no shrink below 260px)

**home.scss Edits:**
1. `.home-page`: display: grid; grid-template-columns: 300px 1fr;
2. `.recent-reports`: width/max-width: 300px; min-width: 280px; padding: 16px; gap: 12px;
3. `.reports-list`: gap: 12px (for margin-bottom effect)
4. `.report-item h3`: font-size: 0.875rem (14px); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; overflow: hidden;
5. `.match-score`: padding: 1px 6px; font-size: 0.75rem; rgba colors softer (0.1 opacity)
6. Responsive: @media <768px grid-template-columns: 1fr; .recent-reports { width: 100%; height: auto; }

**No JSX changes required**
**Next**: Implement SCSS updates after confirmation
