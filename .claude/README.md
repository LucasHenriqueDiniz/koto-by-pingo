# 📖 .claude/ Directory

Agent configuration and validation for **Koto by Pingo** project.

---

## Quick Overview

| File | Purpose |
|------|---------|
| **INSTRUCTIONS.md** | 5-minute onboarding for agents — read first |
| **AGENT_REFERENCE.md** | 10 common tasks with exact steps (checklist format) |
| **EXTERNAL_SKILLS.md** | Claude SEO + AdSense Auditor integration |
| **settings.json** | Project config (build, commands, constraints) |
| **skills/** | Validation scripts (build, content, audit) |
| **templates/** | PR template with checklist |

---

## Start here

1. **New to project?** Read `INSTRUCTIONS.md` (5 min)
2. **Have a task?** Find it in `AGENT_REFERENCE.md` (quick steps)
3. **Before commit?** Run `./.claude/skills/validate-koto-build.sh`
4. **Before deploy?** Run `./.claude/skills/full-audit.sh draft`
5. **External audit?** See `EXTERNAL_SKILLS.md` (Claude SEO, AdSense)

---

## Directory structure

```
.claude/
├── INSTRUCTIONS.md              # 📖 Onboarding (5 min)
├── AGENT_REFERENCE.md           # 🎯 10 common tasks
├── EXTERNAL_SKILLS.md           # 🔗 External tools (Claude SEO, AdSense)
├── settings.json                # ⚙️ Project config
├── README.md                    # 📋 This file
├── skills/
│   ├── validate-koto-build.sh   # ✅ Build + types + files
│   ├── validate-learning-content.sh  # ✅ Vocabulary + kana + exams
│   └── full-audit.sh            # ✅ Comprehensive (draft/live)
└── templates/
    └── PULL_REQUEST.md          # 📋 PR template with checklist
```

---

## Validation Scripts

### Quick check (2 seconds)
```bash
./.claude/skills/validate-koto-build.sh
```
Validates: build passes, TypeScript strict, required files exist.

### Content check (5 seconds)
```bash
./.claude/skills/validate-learning-content.sh
```
Validates: vocabulary words, kana characters, exam questions.

### Full audit (30 seconds)
```bash
./.claude/skills/full-audit.sh draft  # local checks
./.claude/skills/full-audit.sh live   # includes production checks
```
Validates: everything above + SEO + AdSense + Lighthouse.

---

## Common workflow

```bash
# 1. Start feature
git checkout -b feature/add-vocab

# 2. Edit code
vim artifacts/koto/src/data/vocabulary.ts

# 3. Validate before commit
./.claude/skills/validate-koto-build.sh
./.claude/skills/validate-learning-content.sh

# 4. If OK → commit
git add artifacts/koto/
git commit -m "Add vocabulary: 猫 (neko)"

# 5. Before push (for big PRs)
./.claude/skills/full-audit.sh draft

# 6. Push
git push origin feature/add-vocab
```

---

## Hard Constraints

Never break these:

1. **localStorage only via service** — `services/progress/progress.local.ts`
2. **Wouter for routing** — no `react-router-dom`
3. **TypeScript strict** — no implicit `any`
4. **Clerk + D1 integrations** — already in place
5. **Material Symbols icons** — no lucide-react
6. **AdSense placement rules** — never inside exercise cards

See `INSTRUCTIONS.md` for full details.

---

## Key files in project

- **CLAUDE.md** — Full project guide (read before major changes)
- **artifacts/koto/src/App.tsx** — Main router
- **artifacts/koto/src/services/progress/progress.local.ts** — ONLY source of localStorage
- **artifacts/koto/src/data/vocabulary.ts** — Add vocab words here
- **artifacts/koto/src/data/mockExams.ts** — Add exam questions here
- **artifacts/koto/src/types/kana.ts** — Kana type definitions

---

## Development server

```bash
pnpm --filter @workspace/koto run dev
```

Opens at `http://localhost:5173`.

---

## External audits

For comprehensive audits (SEO, AdSense, Lighthouse):

- **Claude SEO:** https://github.com/AgricIDaniel/claude-seo
- **AdSense Auditor:** https://github.com/LucasHenriqueDiniz/adsense-site-auditor

See `EXTERNAL_SKILLS.md` for how to use.

---

## Support

- **Task not in AGENT_REFERENCE.md?** Check `CLAUDE.md` for project details
- **Build failing?** Run `./.claude/skills/validate-koto-build.sh` for diagnostics
- **Content validation?** Run `./.claude/skills/validate-learning-content.sh`
- **Unclear constraint?** See `settings.json` hardConstraints section

---

## Links

- **Project repo:** https://github.com/LucasHenriqueDiniz/koto-by-pingo
- **Reference:** brasil-calculadoras (.claude pattern) https://github.com/LucasHenriqueDiniz/calculadoras-brasil/tree/main/.claude
- **Claude SEO:** https://github.com/AgricIDaniel/claude-seo
- **AdSense Auditor:** https://github.com/LucasHenriqueDiniz/adsense-site-auditor

---

Last updated: 2026-06-25
