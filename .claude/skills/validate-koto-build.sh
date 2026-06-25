#!/bin/bash

# Validate Koto build — checks TypeScript, required files, and build success
# Usage: ./.claude/skills/validate-koto-build.sh

set -e

echo "🔍 Validating Koto build..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check if we're in the right directory
if [ ! -f "artifacts/koto/package.json" ]; then
  echo -e "${RED}✗ Error: artifacts/koto/package.json not found${NC}"
  echo "  Run this script from repository root"
  exit 1
fi

# 1. Check required files exist
echo "📋 Checking required files..."
REQUIRED_FILES=(
  "artifacts/koto/src/App.tsx"
  "artifacts/koto/src/types/kana.ts"
  "artifacts/koto/src/types/vocabulary.ts"
  "artifacts/koto/src/services/progress/progress.local.ts"
  "artifacts/koto/src/data/vocabulary.ts"
  "artifacts/koto/src/data/kana.ts"
  "artifacts/koto/src/data/mockExams.ts"
  "CLAUDE.md"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}  ✓ $file${NC}"
  else
    echo -e "${RED}  ✗ Missing: $file${NC}"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""

# 2. Check for forbidden patterns
echo "🚫 Checking for forbidden patterns..."

# Check for react-router-dom
if grep -r "react-router-dom" artifacts/koto/src/ 2>/dev/null | grep -v node_modules | grep -v ".lock" > /dev/null; then
  echo -e "${RED}  ✗ Found react-router-dom (must use Wouter)${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}  ✓ No react-router-dom${NC}"
fi

# Check for direct localStorage calls (basic check)
if grep -r "localStorage\\.setItem\\|localStorage\\.getItem" artifacts/koto/src/ 2>/dev/null | grep -v "progress.local.ts" | grep -v ".lock" > /dev/null; then
  echo -e "${YELLOW}  ⚠ Possible direct localStorage calls (should use services/progress)${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}  ✓ No direct localStorage calls${NC}"
fi

echo ""

# 3. Run build
echo "🔨 Running build..."
if pnpm --filter @workspace/koto run build > /tmp/koto-build.log 2>&1; then
  echo -e "${GREEN}  ✓ Build passed${NC}"
else
  echo -e "${RED}  ✗ Build failed${NC}"
  echo "  Last 20 lines of build output:"
  tail -20 /tmp/koto-build.log | sed 's/^/    /'
  ERRORS=$((ERRORS + 1))
fi

echo ""

# 4. Summary
echo "📊 Validation Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed!${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ ($WARNINGS warnings)${NC}"
  fi
  exit 0
else
  echo -e "${RED}✗ $ERRORS error(s) found${NC}"
  echo ""
  echo "💡 Tips:"
  echo "  • For TypeScript errors, check CLAUDE.md"
  echo "  • For missing files, check AGENT_REFERENCE.md"
  echo "  • For build issues, run: pnpm --filter @workspace/koto run build"
  exit 1
fi
