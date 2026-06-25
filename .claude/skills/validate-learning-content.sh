#!/bin/bash

# Validate learning content — vocabulary, kana, exams
# Usage: ./.claude/skills/validate-learning-content.sh

set -e

echo "📚 Validating learning content..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Validate vocabulary.ts
echo "📖 Checking vocabulary.ts..."

VOCAB_FILE="artifacts/koto/src/data/vocabulary.ts"
if [ ! -f "$VOCAB_FILE" ]; then
  echo -e "${RED}  ✗ File not found: $VOCAB_FILE${NC}"
  ERRORS=$((ERRORS + 1))
else
  # Count words
  WORD_COUNT=$(grep -o "id: 'v-" "$VOCAB_FILE" | wc -l)
  echo -e "${GREEN}  ✓ Found $WORD_COUNT vocabulary words${NC}"

  # Check for required fields in first few words (basic validation)
  if grep -q "japanese:" "$VOCAB_FILE" && \
     grep -q "kana:" "$VOCAB_FILE" && \
     grep -q "romaji:" "$VOCAB_FILE" && \
     grep -q "meaningPt:" "$VOCAB_FILE" && \
     grep -q "category:" "$VOCAB_FILE" && \
     grep -q "level:" "$VOCAB_FILE"; then
    echo -e "${GREEN}  ✓ All required fields present${NC}"
  else
    echo -e "${RED}  ✗ Missing required fields (japanese, kana, romaji, meaningPt, category, level)${NC}"
    ERRORS=$((ERRORS + 1))
  fi

  # Check for duplicate IDs
  if [ $(grep -o "id: 'v-[^']*'" "$VOCAB_FILE" | sort | uniq -d | wc -l) -gt 0 ]; then
    echo -e "${YELLOW}  ⚠ Duplicate vocabulary IDs found${NC}"
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${GREEN}  ✓ No duplicate IDs${NC}"
  fi
fi

echo ""

# 2. Validate kana.ts
echo "🔤 Checking kana.ts..."

KANA_FILE="artifacts/koto/src/data/kana.ts"
if [ ! -f "$KANA_FILE" ]; then
  echo -e "${RED}  ✗ File not found: $KANA_FILE${NC}"
  ERRORS=$((ERRORS + 1))
else
  # Count kana
  KANA_COUNT=$(grep -o "id: 'kana-" "$KANA_FILE" | wc -l)
  echo -e "${GREEN}  ✓ Found $KANA_COUNT kana characters${NC}"

  # Check for required fields
  if grep -q "character:" "$KANA_FILE" && \
     grep -q "romaji:" "$KANA_FILE" && \
     grep -q "group:" "$KANA_FILE" && \
     grep -q "row:" "$KANA_FILE" && \
     grep -q "type:" "$KANA_FILE"; then
    echo -e "${GREEN}  ✓ All required fields present${NC}"
  else
    echo -e "${RED}  ✗ Missing required fields (character, romaji, group, row, type)${NC}"
    ERRORS=$((ERRORS + 1))
  fi

  # Check for duplicate IDs
  if [ $(grep -o "id: 'kana-[^']*'" "$KANA_FILE" | sort | uniq -d | wc -l) -gt 0 ]; then
    echo -e "${YELLOW}  ⚠ Duplicate kana IDs found${NC}"
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${GREEN}  ✓ No duplicate IDs${NC}"
  fi
fi

echo ""

# 3. Validate mockExams.ts
echo "📝 Checking mockExams.ts..."

EXAMS_FILE="artifacts/koto/src/data/mockExams.ts"
if [ ! -f "$EXAMS_FILE" ]; then
  echo -e "${RED}  ✗ File not found: $EXAMS_FILE${NC}"
  ERRORS=$((ERRORS + 1))
else
  # Count questions
  QUESTION_COUNT=$(grep -o "id: '[n][45]-q-" "$EXAMS_FILE" | wc -l)
  echo -e "${GREEN}  ✓ Found $QUESTION_COUNT exam questions${NC}"

  # Check for required fields
  if grep -q "type:" "$EXAMS_FILE" && \
     grep -q "prompt:" "$EXAMS_FILE" && \
     grep -q "options:" "$EXAMS_FILE" && \
     grep -q "correctOptionId:" "$EXAMS_FILE"; then
    echo -e "${GREEN}  ✓ All required fields present${NC}"
  else
    echo -e "${RED}  ✗ Missing required fields (type, prompt, options, correctOptionId)${NC}"
    ERRORS=$((ERRORS + 1))
  fi

  # Check for duplicate IDs
  if [ $(grep -o "id: '[^']*-q-[^']*'" "$EXAMS_FILE" | sort | uniq -d | wc -l) -gt 0 ]; then
    echo -e "${YELLOW}  ⚠ Duplicate exam question IDs found${NC}"
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${GREEN}  ✓ No duplicate IDs${NC}"
  fi
fi

echo ""

# 4. Validate kanaWords.ts
echo "🔡 Checking kanaWords.ts..."

WORDS_FILE="artifacts/koto/src/data/kanaWords.ts"
if [ ! -f "$WORDS_FILE" ]; then
  echo -e "${RED}  ✗ File not found: $WORDS_FILE${NC}"
  ERRORS=$((ERRORS + 1))
else
  WORDS_COUNT=$(grep -o "id: 'kw-" "$WORDS_FILE" | wc -l)
  echo -e "${GREEN}  ✓ Found $WORDS_COUNT kana words${NC}"
fi

echo ""

# 5. Summary
echo "📊 Content Validation Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ All content checks passed!${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ ($WARNINGS warnings)${NC}"
  fi
  exit 0
else
  echo -e "${RED}✗ $ERRORS error(s) found${NC}"
  echo ""
  echo "💡 Tips:"
  echo "  • Check AGENT_REFERENCE.md for how to add vocabulary/kana/exams"
  echo "  • Ensure all required fields are present"
  echo "  • Check for duplicate IDs (use unique id scheme)"
  exit 1
fi
