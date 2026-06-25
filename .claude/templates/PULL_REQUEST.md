# Pull Request Template — Koto by Pingo

Use this template for PRs. Copy, fill in, and submit.

---

## 📋 Description

**What does this PR do?**
- [ ] Add new feature
- [ ] Fix bug
- [ ] Refactor code
- [ ] Add vocabulary/kana/exams
- [ ] Update documentation
- [ ] Other: ______

**Brief description (1-2 sentences):**

> Replace this with your description

---

## 🎯 Related Issue(s)

Link any related issues:
- Closes #123 (if applicable)
- Related to #456 (if applicable)

---

## 🔍 Validation Checklist

Before submitting, run these:

```bash
# 1. Build passes
pnpm --filter @workspace/koto run build

# 2. Quick validation
./.claude/skills/validate-koto-build.sh

# 3. Content validation (if adding vocab/kana/exams)
./.claude/skills/validate-learning-content.sh

# 4. Full audit (for bigger PRs)
./.claude/skills/full-audit.sh draft
```

**Validation Results:**
- [ ] Build passes (`pnpm run build`)
- [ ] TypeScript strict mode passes
- [ ] No console.log left in code
- [ ] All required files present
- [ ] No direct localStorage calls (uses service instead)

---

## 📝 Changes Made

**Files changed:**
- [ ] `artifacts/koto/src/pages/...` — Page added/updated
- [ ] `artifacts/koto/src/components/...` — Component added/updated
- [ ] `artifacts/koto/src/data/...` — Vocabulary/kana/exams added
- [ ] `artifacts/koto/src/services/...` — Service updated
- [ ] `artifacts/koto/src/types/...` — Type added/updated
- [ ] Other: ______

**Describe changes (be specific):**

> Replace this with details of what changed

---

## ✅ Specific Task Checklist

**If adding vocabulary:**
- [ ] Word added to `artifacts/koto/src/data/vocabulary.ts`
- [ ] Has all 7 fields: id, japanese, kana, romaji, meaningPt, category, level
- [ ] ID is unique (follows `v-NNN` pattern)
- [ ] Category is valid (animais, alimentos, escola, trabalho, etc)
- [ ] Tested in `/vocabulario/treinar` — appears in all 4 modes

**If adding kana:**
- [ ] Character added to `artifacts/koto/src/data/kana.ts`
- [ ] Has all required fields: id, character, romaji, group, row, type
- [ ] ID is unique
- [ ] Tested in `/kana/treinar` — appears in trainer

**If adding exam question:**
- [ ] Question added to `artifacts/koto/src/data/mockExams.ts`
- [ ] Has all fields: id, type, prompt, japaneseText, options[4], correctOptionId, explanation
- [ ] 4 meaningful answer options
- [ ] Correct answer matches `correctOptionId`
- [ ] Tested in `/simulados/{examId}` — appears in sequence

**If fixing a bug:**
- [ ] Bug reproduced locally
- [ ] Fix is minimal and targeted
- [ ] No unnecessary refactoring
- [ ] Tested in dev server

**If adding new page:**
- [ ] Page created in `artifacts/koto/src/pages/`
- [ ] Uses `<PageHeader>` and `updatePageSEO()`
- [ ] Responsive layout (tested on desktop, tablet, mobile)
- [ ] Link added to `DesktopSidebar` and `MobileBottomNav`
- [ ] Route added to `App.tsx`

---

## 🧪 Testing

**How to test this change:**

1. Checkout this branch: `git checkout <branch-name>`
2. Start dev server: `pnpm --filter @workspace/koto run dev`
3. Navigate to relevant page: `http://localhost:5173/...`
4. Test feature:
   - (Describe steps to verify feature works)
   - (List any edge cases tested)
   - (Mention any devices/browsers tested on)

---

## 📱 Responsive Design

- [ ] Tested on desktop (>= 1024px)
- [ ] Tested on tablet (768–1023px)
- [ ] Tested on mobile (< 768px)
- [ ] No layout breaks
- [ ] Touch targets >= 48px (mobile)

---

## ♿ Accessibility

- [ ] Text has sufficient contrast
- [ ] Form inputs labeled properly
- [ ] Keyboard navigation works
- [ ] Images have alt text (if applicable)
- [ ] No rely on color alone to convey meaning

---

## 📊 Code Quality

- [ ] Follows CLAUDE.md conventions
- [ ] No implicit `any` types
- [ ] Uses shared components where possible
- [ ] localStorage only via service (never direct)
- [ ] AdSense placement rules followed (if applicable)

---

## 🚀 Deployment Notes

**For reviewers:**
- This change is safe to merge: Yes / No / Conditional
- Deployment requires: (none / cache clear / database migration / etc)
- Potential breaking changes: None / (describe)

---

## 🔗 References

**Useful links for reviewers:**
- Read first: [CLAUDE.md](../../CLAUDE.md) (project guide)
- Task details: [AGENT_REFERENCE.md](./.claude/AGENT_REFERENCE.md)
- External skills: [EXTERNAL_SKILLS.md](./.claude/EXTERNAL_SKILLS.md)

---

## 👀 Screenshots / Demo (optional)

If visual change, add screenshot:

```
[Paste screenshot here]
```

---

**By submitting this PR, I confirm that:**
- ✓ Code follows project conventions (CLAUDE.md)
- ✓ All validations pass locally
- ✓ Feature is tested in dev server
- ✓ No breaking changes
- ✓ Ready for review

---

*Generated from `.claude/templates/PULL_REQUEST.md`*
