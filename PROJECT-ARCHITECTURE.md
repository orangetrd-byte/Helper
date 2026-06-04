# Helper Project Architecture

## Project Purpose

Helper is a standalone beginner lathe setup and touch-off app. It is designed for new operators who need step-by-step guidance, plain-language definitions, basic calculations, setup notes, handoff support, and offline access on a phone or shop computer.

This app is separate from:

- `CNC-Work-Helper`
- `cnc-cell-planner-pwa`

Do not cross-edit those apps when working on Helper unless explicitly requested.

## Repository Files

- `index.html`  
  Main app file. Contains HTML, CSS, and JavaScript in one offline-friendly page.

- `README.md`  
  Short project summary and feature list.

- `manifest.json`  
  PWA manifest for installable app behavior.

- `sw.js`  
  Service worker for offline caching.

- `PROJECT-ARCHITECTURE.md`  
  Maintainer notes for app structure, storage, data flow, and safe change rules.

## App Structure

Helper is currently a single-page app with section-based navigation. Each major tool is a `<section class="page">` inside `index.html`.

Main sections:

- `wizard`  
  New Setup Wizard. This is the beginner-first guided flow.

- `touch`  
  Beginner Touch-Off Helper. Calculates offset corrections and warns about common mistakes.

- `move`  
  Manual Lathe Move Calculator. Helps calculate move direction and distance.

- `notes`  
  Job Notes, setup status, timestamped note log, backup/import, and handoff summary.

- `feeds`  
  Starter speeds and feeds by material and operation.

- `reference`  
  Setup reference, safe approach tips, touch-off tips, and glossary.

Bottom navigation buttons use `data-page` attributes and call `showPage(id)` through event listeners.

## Beginner Flow

The app should assume the user knows almost nothing.

The setup wizard is the primary guided path:

1. Machine
2. Stock
3. Tools
4. Touch-Off
5. Verify

Each stage contains:

- beginner explanation
- why it matters
- checklist items
- progress count

The wizard data is defined in JavaScript as `wizardStages`. `wizardItems` is derived from all stage items so existing checklist progress logic still works.

## Data Storage

All user data is stored locally in the browser with `localStorage`.

Main key:

```text
touch-off-helper-v1
```

Related page key:

```text
touch-page
```

Data stored under `touch-off-helper-v1` includes:

- `started`
- `notes`
- `log`
- `checks`
- `touchHistory`

Important: keep storage backward compatible when possible. Existing users should not lose notes, checklist progress, or touch-off history after updates.

## Data Model

Current localStorage shape:

```js
{
  started: true,
  notes: {
    partNumber: "",
    material: "",
    machine: "",
    operation: "",
    setupBy: "",
    runBy: "",
    setupStatus: "Ready",
    attentionFlag: "",
    jobNotes: ""
  },
  log: [
    {
      time: "",
      text: "",
      by: ""
    }
  ],
  checks: {
    "Machine and control confirmed": true
  },
  touchHistory: [
    {
      time: "",
      type: "X Diameter",
      method: "Cut and measure",
      unit: "inch",
      current: 0,
      measured: 0,
      target: 0,
      correction: 0,
      corrected: 0,
      warnings: []
    }
  ]
}
```

## Core JavaScript Functions

- `state()`  
  Reads and parses localStorage.

- `saveState(s)`  
  Writes app state to localStorage.

- `ensureSample()`  
  Creates the first-launch sample job if the app has not been started.

- `showPage(id)`  
  Changes the active app section and remembers the last selected page.

- `renderWizard()`  
  Renders staged wizard cards, checklist items, and progress.

- `toggleCheck(item, checked)`  
  Saves checklist progress immediately.

- `calcTouchOff()`  
  Calculates correction and shows warnings for likely input mistakes.

- `saveLastTouch()`  
  Saves the most recent touch-off calculation into history.

- `renderTouchHistory()`  
  Displays saved touch-off calculations.

- `calcMove()`  
  Calculates move distance and direction.

- `saveNotes()` / `loadNotes()`  
  Saves and loads job notes.

- `addLogEntry()` / `renderLog()`  
  Adds and displays timestamped note history.

- `renderHandoff()` / `printHandoff()` / `exportHandoff()`  
  Builds printable/exportable setup handoff information.

- `exportData()` / `importData(input)` / `resetData()`  
  Backup, restore, and reset flow.

- `renderFeeds()`  
  Displays starter speed/feed guidance and basic definitions.

## Touch-Off Guidance

Touch-off guidance must remain beginner-friendly and control-aware.

Diameter/radius mode is control dependent. The app currently explains:

- X diameter mode means X represents full part diameter.
- X radius mode means X represents distance from spindle centerline.
- Some controls use `G7` / `G8` for diameter/radius mode.
- Do not assume those codes apply to every machine.
- Check the program safety block, setup sheet, active modal display, and machine manual.

Avoid writing guidance that implies every lathe uses the same G-code behavior.

## PWA Behavior

`manifest.json` and `sw.js` provide install/offline behavior.

Do not modify `manifest.json` or `sw.js` unless the change is specifically about app install behavior, cache behavior, or offline behavior.

If either file changes, test carefully because GitHub Pages and browser service worker cache can delay visible updates.

## Offline Capability

The app should remain fully usable without a network connection after it has been loaded/cached.

Avoid adding external runtime dependencies, CDN scripts, external fonts, or network-required APIs unless the offline design is updated intentionally.

## Safe Change Rules

- Keep the app as a small single-page PWA unless there is a strong reason to split files.
- Do not remove existing localStorage keys without migration.
- Do not break import/export backup compatibility.
- Do not change service worker registration casually.
- Keep language plain and beginner-friendly.
- Prefer incremental updates over rewrites.
- Test JavaScript syntax after editing.
- Avoid cross-editing other machining apps.

## Recommended Verification

After changes:

1. Run a JavaScript syntax check on the inline script.
2. Open the app locally or from GitHub Pages.
3. Confirm navigation still switches sections.
4. Confirm wizard checklist saves after refresh.
5. Confirm sample job loads only on first start/reset.
6. Confirm touch-off calculation still works.
7. Confirm notes save/load.
8. Confirm export/import still works.
9. Confirm service worker registration was not duplicated.

## Current Development Direction

Priority is guidance before advanced features.

Near-term improvements should focus on:

- clearer step-by-step beginner flow
- better control-specific warnings
- setup verification before machine movement
- safer touch-off explanation
- better notes/handoff clarity

Avoid adding complex scheduling, AI, or shop management features to Helper. Those belong in the other apps unless explicitly requested.