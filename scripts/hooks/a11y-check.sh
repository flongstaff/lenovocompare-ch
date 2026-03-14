#!/usr/bin/env bash
# PostToolUse hook: lightweight static a11y checks on component files
# Checks for common WCAG issues without needing a browser

f="$CLAUDE_FILE_PATH"

# Only check component TSX files
echo "$f" | grep -qE 'components/.*\.tsx$' || exit 0

issues=""

# Check for img without alt
if grep -qE '<img[^>]*>' "$f" 2>/dev/null; then
  missing_alt=$(grep -nE '<img[^>]*>' "$f" | grep -v 'alt=' | head -3)
  if [ -n "$missing_alt" ]; then
    issues="${issues}Missing alt on <img>:\n${missing_alt}\n"
  fi
fi

# Check for click handlers without keyboard equivalent
if grep -qE 'onClick=' "$f" 2>/dev/null; then
  # divs/spans with onClick but no role or onKeyDown
  click_no_key=$(grep -nE '<(div|span)[^>]*onClick=' "$f" | grep -v 'role=' | grep -v 'onKeyDown\|onKeyPress\|onKeyUp' | head -3)
  if [ -n "$click_no_key" ]; then
    issues="${issues}Click handler without keyboard/role on non-interactive element:\n${click_no_key}\n"
  fi
fi

# Check for missing aria-label on icon-only buttons/links
if grep -qE '<(a|button)[^>]*>[^<]*<[A-Z][a-zA-Z]*[^>]*/>[^<]*</(a|button)>' "$f" 2>/dev/null; then
  icon_only=$(grep -nE '<(a|button)[^>]*>[^<]*<[A-Z][a-zA-Z]*[^>]*/>[^<]*</(a|button)>' "$f" | grep -v 'aria-label' | head -3)
  if [ -n "$icon_only" ]; then
    issues="${issues}Icon-only button/link without aria-label:\n${icon_only}\n"
  fi
fi

# Check for missing form labels
if grep -qE '<(input|select|textarea)' "$f" 2>/dev/null; then
  missing_label=$(grep -nE '<(input|select|textarea)' "$f" | grep -v 'aria-label\|aria-labelledby\|id=.*label\|placeholder' | head -3)
  if [ -n "$missing_label" ]; then
    issues="${issues}Form control may be missing label:\n${missing_label}\n"
  fi
fi

# Check for tabIndex > 0 (anti-pattern)
if grep -qE 'tabIndex=["{]?[1-9]' "$f" 2>/dev/null; then
  bad_tabindex=$(grep -nE 'tabIndex=["{]?[1-9]' "$f" | head -3)
  issues="${issues}Positive tabIndex (disrupts natural tab order):\n${bad_tabindex}\n"
fi

if [ -n "$issues" ]; then
  echo -e "A11Y warnings in $(basename "$f"):\n${issues}"
fi

exit 0
