#!/bin/bash
# APEX Phase Regression Detector
# Analyzes changed files to determine which pipeline phases need re-verification.
# Used by: QA agent (before approving), Watcher (continuous monitoring)
#
# Usage: bash detect-phase-regression.sh [base-ref]
#   base-ref: git ref to diff against (default: HEAD~1)
#
# Output: List of phases that need re-verification, or "CLEAN" if none.

BASE_REF="${1:-HEAD~1}"
CHANGED_FILES=$(git diff --name-only "$BASE_REF" HEAD 2>/dev/null)

if [ -z "$CHANGED_FILES" ]; then
  echo "CLEAN: No file changes detected"
  exit 0
fi

# Track which phases need re-run
RERUN_VERIFY=0
RERUN_BUILD_P0=0
RERUN_BUILD_P1=0
RERUN_QA=0
RERUN_DESIGN=0
SHARED_AUDIT=0

for file in $CHANGED_FILES; do
  case "$file" in
    # Shared components — high blast radius
    src/components/*)
      USAGE_COUNT=0
      if [ -d "src" ]; then
        BASENAME=$(basename "$file" .tsx)
        USAGE_COUNT=$(grep -rl "$BASENAME" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
      fi
      RERUN_BUILD_P0=1
      RERUN_QA=1
      if [ "$USAGE_COUNT" -ge 2 ]; then
        SHARED_AUDIT=1
      fi
      ;;

    # Pages — affects specific user flows
    src/pages/*|src/app/*)
      RERUN_BUILD_P0=1
      RERUN_QA=1
      RERUN_DESIGN=1
      ;;

    # Utilities — can affect many files
    src/utils/*|src/lib/*|src/hooks/*)
      RERUN_BUILD_P0=1
      RERUN_BUILD_P1=1
      RERUN_QA=1
      ;;

    # Design system — affects ALL UI
    globals.css|src/styles/*|tailwind.config.*)
      RERUN_QA=1
      RERUN_DESIGN=1
      ;;

    # Dependencies — must re-verify
    package.json|package-lock.json)
      RERUN_VERIFY=1
      RERUN_BUILD_P0=1
      RERUN_QA=1
      ;;

    # Config — affects runtime
    .env*|next.config.*|vite.config.*)
      RERUN_BUILD_P0=1
      RERUN_QA=1
      ;;

    # API routes — affects integrations
    src/app/api/*|src/pages/api/*)
      RERUN_BUILD_P0=1
      RERUN_QA=1
      ;;

    # Framework files — affects pipeline itself
    .claude/agents/*|.claude/skills/*|.claude/scripts/*)
      RERUN_QA=1
      ;;

    # Docs only — no regression
    *.md|CHANGELOG*|README*|docs/*)
      # No phase regression for documentation changes
      ;;
  esac
done

# Output results
REGRESSIONS_FOUND=0

if [ "$RERUN_VERIFY" -eq 1 ] || [ "$RERUN_BUILD_P0" -eq 1 ] || [ "$RERUN_QA" -eq 1 ] || [ "$RERUN_DESIGN" -eq 1 ]; then
  REGRESSIONS_FOUND=1
  echo "REGRESSION DETECTED — phases need re-verification:"
  [ "$RERUN_VERIFY" -eq 1 ] && echo "  Phase 4: VERIFY — re-run /verify-lib on changed dependencies"
  [ "$RERUN_BUILD_P0" -eq 1 ] && echo "  Phase 5a: BUILD P0 — re-run P0 tests"
  [ "$RERUN_BUILD_P1" -eq 1 ] && echo "  Phase 5b: BUILD P1 — re-run P1 tests (shared utility changed)"
  [ "$RERUN_DESIGN" -eq 1 ] && echo "  Phase 4+6: DESIGN — re-verify DNA compliance"
  [ "$RERUN_QA" -eq 1 ] && echo "  Phase 6: QUALITY — re-run full QA gate"
  [ "$SHARED_AUDIT" -eq 1 ] && echo "  SHARED COMPONENT — audit all dependent tasks"
  echo ""
  echo "Changed files:"
  echo "$CHANGED_FILES" | sed 's/^/  /'
else
  echo "CLEAN: Changes are documentation-only, no phase regression"
fi

exit $REGRESSIONS_FOUND
