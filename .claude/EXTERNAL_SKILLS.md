# 🔗 External Skills & Audits

Referência para ferramentas externas de validação e auditoria.

---

## 📊 Claude SEO

**Purpose:** Comprehensive SEO audit — keyword research, on-page analysis, content gaps, technical checks.

**When to use:**
- Before deploying new pages (HomePage, AulasExtrasPage, etc)
- To validate meta tags and page descriptions
- To find content gaps competitors own
- To check lighthouse score + technical SEO

**Link:** https://github.com/AgricIDaniel/claude-seo

**How to use:**

1. Clone repo:
   ```bash
   git clone https://github.com/AgricIDaniel/claude-seo.git /tmp/claude-seo
   cd /tmp/claude-seo
   ```

2. Run audit on localhost:
   ```bash
   # Ensure Koto dev server is running
   pnpm --filter @workspace/koto run dev  # http://localhost:5173

   # In claude-seo directory, run audit
   ./scripts/audit.sh http://localhost:5173
   ```

3. Review report:
   - Meta tags (title, description, OG tags)
   - Canonical URLs
   - Structured data (schema.org)
   - Lighthouse scores
   - Keyword density
   - Content gaps

**Example output:**
```
✅ Title tag present: "Koto by Pingo — Aprenda Japonês"
✅ Meta description (157 chars): "App de aprendizado de japonês 100% offline..."
⚠️  Missing OG image tag
⚠️  Lighthouse performance: 75 (target: 90+)
❌ Canonical URL missing
```

**Koto-specific checklist:**
- [ ] HomePage has proper meta tags
- [ ] All `/kana/*` pages have unique descriptions
- [ ] Vocabulary pages indexed properly
- [ ] No duplicate title tags
- [ ] OG tags for social sharing
- [ ] Lighthouse >= 80

---

## 📢 AdSense Auditor

**Purpose:** Validate AdSense placement, revenue potential, compliance with policies.

**When to use:**
- Before enabling AdSense (need approval from Google first)
- To validate `<AdPlaceholder>` positions
- To check ad density (shouldn't exceed recommended ratio)
- To ensure content quality for monetization

**Link:** https://github.com/LucasHenriqueDiniz/adsense-site-auditor

**How to use:**

1. Clone repo:
   ```bash
   git clone https://github.com/LucasHenriqueDiniz/adsense-site-auditor.git /tmp/adsense-auditor
   cd /tmp/adsense-auditor
   ```

2. Run audit on localhost:
   ```bash
   # Ensure Koto dev server is running
   pnpm --filter @workspace/koto run dev

   # In adsense-auditor directory
   ./scripts/audit.sh http://localhost:5173
   ```

3. Review report:
   - Ad placement validation
   - Ad density ratio
   - Revenue potential estimate
   - Policy compliance
   - User experience impact
   - Placement recommendations

**Example output:**
```
✅ Ad placement valid: sidebar (not in exercise cards)
✅ Ad density: 2.3% (recommended: 1-3%)
⚠️  Revenue potential: Low-to-Medium (educational niche)
⚠️  Suggested placement: Add one more ad in dashboard
❌ Missing AdSense code in HTML head
```

**Koto-specific checklist:**
- [ ] `<AdPlaceholder>` not in flashcard/quiz cards
- [ ] At least 16px spacing around ads
- [ ] Max 3 ad placements visible per page
- [ ] No ads on login page (`/entrar`)
- [ ] AdSense code in `public/index.html` (production)
- [ ] Ad policy: educational content (should be approved)

---

## 🎯 Integration Workflow

### For PRs (checklist)

```bash
# 1. Run Koto build validation
./.claude/skills/validate-koto-build.sh

# 2. Run learning content validation
./.claude/skills/validate-learning-content.sh

# 3. Run full audit (local)
./.claude/skills/full-audit.sh draft

# 4. Optional: Run external audits
# - Clone Claude SEO + AdSense Auditor
# - Run both against localhost:5173
# - Review reports

# 5. Commit only after all pass
git add .
git commit -m "Feature: ..."
git push origin main
```

### For deployment (checklist)

```bash
# 1. Run full local audit
./.claude/skills/full-audit.sh draft

# 2. If passed, run live audit (production domain)
./.claude/skills/full-audit.sh live

# 3. Run external audits on live domain
# - Claude SEO on https://koto-by-pingo.vercel.app (or prod URL)
# - AdSense Auditor on prod URL

# 4. Review all reports
# 5. If green, deploy
```

---

## 🔄 Automation (Future)

These audits can be integrated into CI/CD:

```yaml
# .github/workflows/audit.yml (example)
name: Audit on Push

on: [push]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: ./.claude/skills/validate-koto-build.sh
      - run: ./.claude/skills/validate-learning-content.sh
      - run: ./.claude/skills/full-audit.sh draft
```

---

## 📌 Quick Reference

| Tool | Purpose | When | Command |
|------|---------|------|---------|
| validate-koto-build.sh | Fast build + files check | Before every commit | `./.claude/skills/validate-koto-build.sh` |
| validate-learning-content.sh | Vocabulary/kana/exams check | Before vocab/kana/exam changes | `./.claude/skills/validate-learning-content.sh` |
| full-audit.sh draft | Local comprehensive audit | Before PR | `./.claude/skills/full-audit.sh draft` |
| Claude SEO | SEO audit + lighthouse | Before deploy | Run on localhost:5173 |
| AdSense Auditor | Ad placement + revenue | Before enabling ads | Run on localhost:5173 |

---

## 🔗 Tool Repos

- **Claude SEO:** https://github.com/AgricIDaniel/claude-seo
- **AdSense Auditor:** https://github.com/LucasHenriqueDiniz/adsense-site-auditor

Both are standalone — clone into `/tmp/` and run independently.

---

## ⚠️ Important Notes

1. **AdSense approval** — Google must approve Koto for AdSense before ads show real revenue. Educational content usually takes 2-4 weeks.
2. **SEO for educational apps** — Koto doesn't need high organic traffic initially; focus on content quality + user experience.
3. **Ad placement** — Start with 1-2 placements (before session, sidebar) and expand based on user feedback.
4. **Privacy** — Ensure privacy policy covers AdSense data collection (Koto doesn't track much, but third-party ads do).

---

## 📊 Sample Report Structure

After running Claude SEO or AdSense Auditor, you'll get:

```
AUDIT REPORT — Koto by Pingo
Generated: 2026-06-25
URL: http://localhost:5173

## SEO Audit
✅ Title tags (10/10 pages)
✅ Meta descriptions (10/10)
⚠️  OG images (7/10)
❌ Canonical URLs (0/10)
Score: 85/100

## AdSense Audit
✅ Placement (3 valid placements)
✅ Density (2.1% — within limits)
⚠️  Revenue potential (Medium for niche)
Score: 75/100

## Recommendations
1. Add OG images to all pages
2. Add canonical URLs (meta tag rel="canonical")
3. Consider one more ad placement in dashboard
4. Improve LCP (Largest Contentful Paint)
```

---

## Next Steps

1. Run `validate-koto-build.sh` + `full-audit.sh draft` before every PR
2. Before deploy, run Claude SEO + AdSense Auditor on staging
3. Monitor reports and iterate
4. Update this doc if new external tools are added
