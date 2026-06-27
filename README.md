# Touch-Off Helper

Standalone beginner lathe setup app.

## Sections

- New Setup Wizard
- Beginner Touch-Off Helper
- Manual Lathe Move Calculator
- Job Notes
- Speeds / Feeds
- Setup Reference
- Lathe Setup Tips
- Touch-off Tips
- Safe Approach / Retract Tips
- Symbols & Meanings
- Import / Export

## Notes

- This is a new app and does not modify the existing PWA Helper.
- Uses localStorage for notes, checklist state, timestamped note log, sample job state, and last selected page.
- Includes a simple PWA manifest and service worker.
- First launch loads a sample job so a beginner can see how the app is meant to be used.
- The setup wizard is grouped into beginner-friendly stages: Machine, Stock, Tools, Touch-Off, and Verify.
- Each wizard stage explains what to check and why it matters before the operator moves forward.
- The setup wizard includes beginner definitions for shop terms such as stickout, control confirmed, work zero, offsets, single block, and feed override.
- Touch-off guidance explains where to check diameter/radius mode in the program safety block, setup sheet, active modal display, and control-specific G-codes such as G7/G8 where applicable.
- Touch, Move, Notes, and Speeds / Feeds include small field-level helper text so a new operator is not expected to know the terms first.
- The touch-off helper includes inline warnings for common mistakes such as diameter/radius confusion and large offset corrections.
- Touch-off calculations can be saved to a recent history list.
- Job Notes includes a handoff summary with print and JSON export support.
## Current Project Status

**Status as of June 27, 2026:** Back-burner / legacy helper repo.

Helper is not the current focus. CNC Work Helper and Green Hat are the active split of the helper idea: CNC Work Helper for more capable shop tools, Green Hat for true beginners.

Where it stands:

- This repo should be maintained only for preservation, small fixes, or reference unless explicitly reactivated.
- Do not use this repo as the main place for new CNC Work Helper or Green Hat features.
- If useful ideas are found here, move them intentionally into the correct active repo instead of expanding this one.
- MGP build/version information must remain visible and cannot be removed.

Next practical focus:

- Leave stable unless a specific cleanup, documentation, or migration task is requested.

## Assistant Change Guidelines

Before making code or file changes in this repo:

1. Clarify the beginner touch-off goal, assumptions, constraints, and measurable success criteria.
2. Use structured output for setup steps, checklists, risks, documentation, and troubleshooting.
3. Compare options before changing setup wizard behavior, touch-off logic, references, storage, dependencies, or AI behavior.
4. Use brainstorming only for beginner-safe guidance, checklist, reference, and UI ideas.
5. Give technical explanations only when needed, and keep them plain-English and beginner-safe.
6. Draft concise documentation or handoff notes for user-facing workflow changes.
7. Use a troubleshooting checklist before fixing bugs in setup wizard, touch-off helper, notes, references, import/export, or offline behavior.
8. Use learning-path content when it helps users understand safe setup habits.
9. Assess risks before adding automation, AI fallback, generated instructions, or setup guidance changes.
10. Optimize only for a named goal such as clarity, reliability, readability, offline use, or beginner safety.

Permanent rule: MGP must remain visible in build/version information and cannot be removed, hidden, renamed, or replaced.

