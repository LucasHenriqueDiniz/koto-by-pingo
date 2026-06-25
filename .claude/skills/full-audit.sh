#!/bin/bash

# Full audit for Koto — comprehensive validation (draft/live modes)
# Usage: ./.claude/skills/full-audit.sh [draft|live]
# Default: draft (local checks only)

MODE="${1:-draft}"

echo "🔍 Running full audit (mode: $MODE)..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

# Helper functions
check_passed() {
  echo -e "${GREEN}  ✓ $1${NC}"
  PASSED_CHECKS=$((PASSED_CHECKS + 1))
  TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
}

check_failed() {
  echo -e "${RED}  ✗ $1${NC}"
  FAILED_CHECKS=$((FAILED_CHECKS + 1))
  TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
}

check_warning() {
  echo -e "${YELLOW}  ⚠ $1${NC}"
  WARNINGS=$((WARNINGS + 1))
  TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  BUILD VALIDATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ./.claude/skills/validate-koto-build.sh > /tmp/koto-audit-build.log 2>&1; then
  check_passed "Build validation passed"
else
  check_failed "Build validation failed"
  tail -10 /tmp/koto-audit-build.log | sed 's/^/    /'
fi

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  LEARNING CONTENT VALIDATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ./.claude/skills/validate-learning-content.sh > /tmp/koto-audit-content.log 2>&1; then
  check_passed "Learning content validation passed"
else
  check_failed "Learning content validation failed"
  tail -10 /tmp/koto-audit-content.log | sed 's/^/    /'
fi

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  PROJECT STRUCTURE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check .claude/ exists
if [ -d ".claude" ]; then
  check_passed ".claude/ directory exists"
else
  check_failed ".claude/ directory missing"
fi

# Check CLAUDE.md exists
if [ -f "CLAUDE.md" ]; then
  check_passed "CLAUDE.md exists"
else
  check_failed "CLAUDE.md missing"
fi

# Check settings.json
if [ -f ".claude/settings.json" ]; then
  check_passed ".claude/settings.json exists"
else
  check_failed ".claude/settings.json missing"
fi

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  CODE QUALITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for console.log in production code (warning)
if grep -r "console\\.log" artifacts/koto/src/ 2>/dev/null | grep -v ".test." | grep -v ".spec." > /dev/null; then
  check_warning "console.log found in code (should be cleaned up)"
else
  check_passed "No console.log in code"
fi

# Check for TODO comments (info only)
TODO_COUNT=$(grep -r "TODO\|FIXME" artifacts/koto/src/ 2>/dev/null | grep -v node_modules | wc -l)
if [ $TODO_COUNT -gt 0 ]; then
  check_warning "$TODO_COUNT TODO/FIXME comments found"
else
  check_passed "No TODO/FIXME comments"
fi

echo ""

if [ "$MODE" = "live" ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "5️⃣  LIVE CHECKS (Production Domain)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "💡 Live checks require external tools:"
  echo "  • Claude SEO (for SEO audit)"
  echo "  • AdSense Auditor (for ad placement validation)"
  echo "  • Google Lighthouse (for performance)"
  echo ""
  echo "See EXTERNAL_SKILLS.md for how to run these audits."
  echo ""
fi

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 AUDIT SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Total checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"
if [ $FAILED_CHECKS -gt 0 ]; then
  echo -e "${RED}Failed: $FAILED_CHECKS${NC}"
fi
if [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
fi

echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
  echo -e "${GREEN}✓ All critical checks passed!${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ Review warnings above${NC}"
  fi
  echo ""
  if [ "$MODE" = "draft" ]; then
    echo "📋 Next steps:"
    echo "  1. Review any warnings above"
    echo "  2. Test feature in dev server: pnpm --filter @workspace/koto run dev"
    echo "  3. Commit: git add . && git commit -m '...'"
    echo "  4. Push: git push origin <branch>"
    echo ""
    echo "For live deployment:"
    echo "  1. Run: ./.claude/skills/full-audit.sh live"
    echo "  2. Run external audits: see EXTERNAL_SKILLS.md"
    echo "  3. Deploy to production"
  fi
  exit 0
else
  echo -e "${RED}✗ Fix errors above before proceeding${NC}"
  echo ""
  echo "💡 Tips:"
  echo "  • Run individual scripts for more details:"
  echo "    - ./.claude/skills/validate-koto-build.sh"
  echo "    - ./.claude/skills/validate-learning-content.sh"
  echo "  • Check AGENT_REFERENCE.md for common tasks"
  echo "  • Check CLAUDE.md for project constraints"
  exit 1
fi
