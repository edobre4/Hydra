# Hydra Patch Notes

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
