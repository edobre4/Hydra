# Hydra Patch Notes

## v3.72 — 2026-08-21

### Flow Graph
- **Every raw PMET metric is now its own toggleable line.** In addition to the
  derived series (Total/Manual/D2C/Target/…), each individual metric (Sorted\u2192
  Dock, Fluid Load, Pallet/Bag/Gaylord/Cart CB, Cart/Gaylord D2C, Inducted,
  Containers Closed, Pallet\u2192Dock, Gaylord\u2192Stacking) can be enabled on its own.
  Sites that emit different metrics can pick exactly what they need.
- Settings ▸ Flow Graph metric list is now grouped: **Enabled** on top, then
  **Derived**, then **Raw PMET metrics (per-site)**. All raw metrics are off by
  default; enabling any is persisted per browser.

## v3.71 — 2026-08-21

### Flow Graph
- **Metrics/lines toggle list in Inbound Settings ▸ Flow Graph.** Every chart
  series now has a checkbox; enabled ones are listed first and the default set
  (Total, Manual, D2C, Target) is on by default. Toggling repaints the chart
  and stays in sync with the on-chart legend both ways.
- Series definitions consolidated into one source of truth (FG_SERIES_DEFS)
  used by the chart, legend, and settings list. Removed the dead TPH-divisor
  settings row (the TPH line was removed in 3.69).

## v3.70 — 2026-08-21

### Flow Graph (fix)
- **Fixed "refreshFlowGraph is not defined" error** on refresh/settings. The
  Flow Graph functions were accidentally nested inside renderIBTable, so the
  refresh path and settings handlers (outside that scope) couldn't see them.
  Moved them to top level. This also fixes their state vars (loading flag,
  headcount cache) silently resetting on every render.
- **Clarified Live TPH denominator.** The badge now reads "@ N assigned"
  because it divides by WATT getStaffingAssignments (assigned associates), not
  clocked-in. On the Right Station dashboard this is the "Assigned" number, not
  "Clocked in".

## v3.69 — 2026-08-21

### Flow Graph
- **Removed the TPH line** from the chart (the Live TPH badge stays).
- **Fixed legend toggles not doing anything.** Clicking a series now re-renders
  the chart directly into its container instead of routing through the IB table
  renderer (which reset the container first and dropped the change). Legend
  entries now show a ☑/☐ checkbox and strike through when a series is hidden,
  so on/off state is obvious. Target/Hours/Window controls repaint the same way.

## v3.68 — 2026-08-21

### Flow Graph (fix)
- **Fixed the window dropdown snapping shut immediately.** The async live-
  headcount fetch (and background refreshes) re-rendered the whole tab via
  innerHTML, destroying the open native `<select>` mid-click. Now the Live TPH
  badge updates in place, and a full re-render is skipped whenever one of the
  Flow Graph controls (a `<select>` or focused input) is being interacted with.

## v3.67 — 2026-08-21

### Flow Graph
- **New series** (each toggleable via the legend, visibility now persists):
  Inducted, Containers Closed (WS), Pallet\u2192Dock, and Gaylord\u2192Stacking, from
  verified PMET metrics. Total/Manual/D2C/TPH still use only the package
  throughput metrics.
- **Live TPH badge** \u2014 current 5-min Total \u00d7 12 \u00f7 live headcount (from WATT
  getStaffingAssignments). A numeric readout, not a line, since WATT headcount
  is a current snapshot with no history.
- **Window picker** \u2014 choose "Past hours" or a named shift (Day/Twi/Nit/Mor/
  WD/OVN). Shift windows resolve in local site time and handle overnight wrap.
- **Sort Times settings** \u2014 new section to edit each shift's start/end (local
  24h HH:MM); drives the window picker.

## v3.66 — 2026-08-21

### Flow Graph (fix)
- **Fixed "No data returned" on the Flow Graph tab.** The MonitorPortal
  request used the wrong per-metric param spelling (`Period_1`/`Stat_1` with
  an underscore), which the API answers with the literal body
  "No valid data found". Corrected to `Period1`/`Stat1` (no underscore).
- **Fetch each metric in its own request.** Packing all 8 metrics into a
  single request only ever returned the first metric's row; Hydra now issues
  8 parallel single-metric requests and merges them into aligned 5-min
  buckets. Metrics with no data for the window (e.g. Bag on a quiet shift)
  render as a clean zero series instead of breaking the pull.
- The auth/session hint ("open monitorportal.amazon.com once…") now only
  shows when *every* metric request fails, so real empty data is no longer
  mistaken for an auth problem.

## v3.65 — 2026-08-19

### Flow Graph (new INBOUND tab)
- **New "Flow Graph" tab** — live 5-minute sort throughput chart rendered
  inside Hydra, replicating Ivan's MonitorPortal iGraph ("ORD9 Throughput -
  5 Minute Periods"). Pulls PMET scan counts via MonitorPortal
  (`GetMetricData`) over the operator's existing Midway cookie session and
  refreshes on the normal refresh path.
- **Series** — Total Volume (bold), Manual, D2C, and TPH lines plus a flat
  Target/5-min reference line. All derived series are computed client-side
  from the 8 underlying `postLabor` metrics (loaded + palletized paths).
- **Interactivity** — click-to-toggle legend, hover crosshair with per-bucket
  values, and inline editors for Target/5-min, TPH divisor, and lookback
  window (also configurable under Settings ▸ Flow Graph, persisted).
- **PMET lag guard** — the last 2 (still-ingesting) buckets are shaded and
  dashed so the provisional tail dip is not misread as a flow crash.

## v3.63 — 2026-08-15

### Fixes
- **WS Buffer / DDU routes** — fixed a route filter bug that silently dropped
  valid DDU containers sitting in `WS_BUFFER_LANE_*_DDU` locations. WS Buffer
  now shows DDU route rows correctly instead of only AMZL (CYC1) routes.
- **CPT Performance merge suggestions** — 0-cube containers no longer show up
  as merge candidates.
- **Dock Door Panel** — fixed 3P / empty-trailer owner labels (e.g. "EMALV")
  overflowing and clipping inside the door cell; owner name now wraps cleanly
  under the "E" marker.
- **Auto-fit zoom** — now re-applies automatically after resizing the panel
  (drag handles) or double-clicking the logo to reset panel size. Previously
  only fired on window resize.

### SDT Chase
- **Risk / Opportunity detector** — rebuilt on a real row-capacity model
  instead of a flat 36-container cap: cart = ⅓ row, pallet/shuttle/gaylord =
  ½ row, 12 rows per trailer. Correctly flags trailers where a careless
  closed-only pick can underutilize the trailer, and distinguishes:
  - **Opportunity** — underutilization is possible, but the floor has enough
    volume (including open containers) to still hit target.
  - **Risk** — underutilization is possible and no floor combination can
    reach target.
  - Loose packages and containers already in a merge suggestion are excluded
    from the candidate pool (assumed sidelined).
- **Trailer layout diagram** — new visual in the right panel showing the
  12-row trailer as proportional cells (C/G/S/P for Cart/Gaylord/Shuttle/
  Pallet), with loaded containers plus current picks or the active Risk/
  Opportunity highlight overlaid.
- **Left rail controls** — added a status filter dropdown and a SDT/Cube sort
  toggle for the trailer rail (previously SDT-order only).
- Auto-suggest now uses the same row-capacity + cube-density model as the
  Risk/Opportunity detector (previously used a flat container-count cap).

### CPT Performance
- Added cart-count columns.

### Presets
- Added ORD9-adjacent **IGQ9** default preset.

### Data / plumbing
- Started `hydra_web/` — a staged, verbatim module split of Hydra.user.js
  plus a pluggable transport layer (gm / extension / proxy / direct
  adapters) and a companion browser extension ("Hydra Bridge") that proxies
  authenticated calls for a future standalone website. Not shipped to users;
  lives alongside the userscript for ongoing migration work.

---
*Distribution: released via Carthamus (Tampermonkey auto-update). GitHub
(`edobre4/Hydra`) is dev-history backup only.*
