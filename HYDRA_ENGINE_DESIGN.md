# Hydra Engine — Design Document

## 1. Purpose

Hydra Engine is a universal pipeline optimization system for Amazon Sort Centers. It takes real-time floor data, models the facility as a directed graph of process paths, and produces optimal headcount allocation that maximizes throughput (TPH) while respecting operational constraints.

## 2. Problem Statement

Every sort center makes staffing decisions 10+ times per shift — allocating finite headcount across process paths to maximize throughput. Today this is done by:

- Manual estimation using static spreadsheet planners (built once pre-shift, stale within 20 minutes)
- Gut-feel adjustments as conditions change
- Inconsistent quality across shifts, sites, and experience levels

The result: suboptimal TPH, missed CPTs, overstaffed areas coexisting with bottlenecks, and no systematic way to improve decision quality across 100+ sort centers.

## 3. What It Solves

| Problem | How Engine Solves It |
|---|---|
| Static plans go stale | Continuously re-optimizes as live data changes |
| Too many variables for mental math | Evaluates all constraints simultaneously |
| Inconsistent across shifts/people | Same engine, same quality regardless of who's running the floor |
| Each site is unique | Universal graph model adapts to any topology |
| No feedback loop | Logs recommendations vs outcomes for continuous improvement |

## 4. Product Requirements

### 4.1 Functional Requirements

- **FR-1:** Accept any sort center's process topology as a directed graph
- **FR-2:** Ingest live data (trailers, WIP, headcount, rates) from existing APIs
- **FR-3:** Produce optimal HC allocation across all process paths given current state
- **FR-4:** Respect all operational constraints (min/max HC, grouping rules, flow physics)
- **FR-5:** Support two operating modes: aggressive (Race Car) and conservative (Boat)
- **FR-6:** Provide phased timeline showing when staffing should shift as conditions change
- **FR-7:** Report projected throughput (transient and steady-state)
- **FR-8:** Identify current bottleneck and recommend action
- **FR-9:** Flag risks (WIP depletion, recirc, scanner starvation) with time-to-threshold
- **FR-10:** Work for any NASC regardless of equipment type, process paths, or volume mix

### 4.2 Non-Functional Requirements

- **NFR-1:** Produce a recommendation within 60 seconds of request
- **NFR-2:** No site-specific code — all variation handled through graph definition
- **NFR-3:** Operate from a userscript (Tampermonkey) with no infrastructure dependencies beyond a lightweight AI server
- **NFR-4:** Self-validate all recommendations against constraint checklist before presenting
- **NFR-5:** Degrade gracefully when data is unavailable (flag missing inputs, optimize with what's available)

## 5. Architecture

### 5.1 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        HYDRA (Browser)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────────┐     │
│  │ API Layer │   │  Data    │   │   Graph Engine        │     │
│  │ SSP, YMS  │──▶│  Mapper  │──▶│   (JS, deterministic) │     │
│  │ WATT,STEM │   │          │   │                       │     │
│  │ QBCC      │   │ raw data │   │ • Bottleneck finder   │     │
│  └──────────┘   │ → graph  │   │ • Flow calculator     │     │
│                  │  nodes   │   │ • Constraint validator │     │
│                  └──────────┘   │ • WIP projector       │     │
│                                  └───────────┬───────────┘     │
│                                              │                 │
│                                              ▼                 │
│                                  ┌──────────────────────┐     │
│                                  │    AI Reasoning Layer  │     │
│                                  │    (via server/Bedrock) │     │
│                                  │                        │     │
│                                  │ • Tradeoff decisions   │     │
│                                  │ • Phased planning      │     │
│                                  │ • Edge case handling   │     │
│                                  │ • Natural language     │     │
│                                  │   explanation          │     │
│                                  └───────────┬───────────┘     │
│                                              │                 │
│                                              ▼                 │
│                                  ┌──────────────────────┐     │
│                                  │     User Interface     │     │
│                                  │  Allocation table      │     │
│                                  │  Flow rates            │     │
│                                  │  Timeline              │     │
│                                  │  Risk flags            │     │
│                                  └──────────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Layer Responsibilities

| Layer | What It Does | Deterministic? |
|---|---|---|
| API Layer | Authenticates, pulls raw data from Amazon systems | Yes |
| Data Mapper | Routes raw API data to graph nodes | Yes |
| Graph Engine | Math: flow rates, bottlenecks, constraint validation, WIP projection | Yes |
| AI Reasoning | Judgment: tradeoffs, phasing, mode selection, explanation | No |
| UI | Presents recommendation, accepts user input/overrides | Yes |

### 5.3 Design Principle: Code Does Math, AI Does Judgment

The Graph Engine handles everything deterministic — flow calculations, constraint checking, bottleneck identification. It never hallucinates because it's arithmetic.

The AI handles everything that requires reasoning — should we burn WIP or hold steady? Which trailer to prioritize when two compete? How to phase the plan across the hour? What to do when an edge case doesn't fit the rules?

Neither does both.

## 6. Data Model

### 6.1 Graph Node (Process Path)

```json
{
  "id": "ar_induct",
  "name": "AR Induct",
  "rate_per_5min": 33,
  "min_hc": 3,
  "max_hc": 20,
  "current_hc": 0,
  "constraints": [],
  "feeds": ["mezz_wip"],
  "fed_by": ["fluid_unload", "bb_unload"],
  "volume_source": null,
  "split_to": {
    "mezz_wip": 1.0
  }
}
```

### 6.2 Source Node (Volume Entry Point)

```json
{
  "id": "ib_trailers",
  "type": "source",
  "children": [
    {
      "id": "trailer_113F62J94",
      "category": "container",
      "volume_remaining": 4242,
      "door": 221,
      "status": "UNLOADING"
    }
  ]
}
```

### 6.3 WIP Pool

```json
{
  "id": "mezz_wip",
  "type": "wip_pool",
  "current_level": 3000,
  "fed_by": ["ar_induct", "robin_induct"],
  "feeds": ["scanner"],
  "drain_reduces_by": ["ar_flow_direct"],
  "thresholds": {
    "danger_low_min_per_worker": 15,
    "ideal_low_min_per_worker": 30,
    "ideal_high_min_per_worker": 60,
    "danger_high_recirc": true
  }
}
```

### 6.4 Output Node (TPH Definition)

```json
{
  "id": "tph_output",
  "type": "output",
  "formula": "(scanner_output + ar_flow_direct) * 12 / total_hc",
  "components": ["scanner", "ar_flow"],
  "denominator": "total_hc"
}
```

### 6.5 Site Graph (Complete Example — ORD9)

```json
{
  "site": "ORD9",
  "nodes": ["fluid_unload", "bb_unload", "container_unload", "ar_induct", "robin_induct", "scanner"],
  "wip_pools": ["mezz_wip"],
  "sources": ["ib_trailers"],
  "outputs": ["tph_output"],
  "edges": [
    {"from": "fluid_unload", "to": "ar_induct", "split": 1.0},
    {"from": "bb_unload", "to": "ar_induct", "split": 0.75},
    {"from": "bb_unload", "to": "nc_output", "split": 0.25},
    {"from": "container_unload", "to": "robin_induct", "split": 1.0},
    {"from": "ar_induct", "to": "mezz_wip", "split": 1.0},
    {"from": "robin_induct", "to": "mezz_wip", "split": 0.5},
    {"from": "robin_induct", "to": "ar_flow_direct", "split": 0.5},
    {"from": "mezz_wip", "to": "scanner", "split": 1.0}
  ],
  "mode": "racecar"
}
```

## 7. Optimization Algorithm (Universal)

```
INPUT: Graph + live data + user settings (mode, HC, targets)
OUTPUT: HC allocation per node + projected flows + timeline

ALGORITHM:
1. IDENTIFY output node (what defines TPH)
2. WORK BACKWARDS through the graph:
   a. Output node: how much can it produce given WIP state?
   b. WIP pools: growing/draining/steady? Determine mode.
   c. Middle nodes: what feed rate does the output need?
   d. Source nodes: what volume is available to feed the pipeline?
3. LOCK mandatory allocations (min HC constraints, fixed crews)
4. SIZE each node's HC based on what downstream needs (top-down)
5. VALIDATE:
   - Every node's capacity ≥ its input flow (no jams)
   - All constraints satisfied
   - HC sums to available flow HC
   - WIP trajectory stays within thresholds for the planning horizon
6. IF validation fails: adjust and re-run
7. CALCULATE projected flows, TPH (transient + steady-state), timeline
8. PASS to AI layer for: phasing logic, explanation, risk narrative
```

## 8. Data Mapper (API → Graph)

| API Source | Maps To |
|---|---|
| SSP IB trailers (ibTableData) | Source node children (volume, type, status, ETA) |
| SSP OB trailers | Output constraints (CPT deadlines, loaded %) |
| YMS yard state | Door assignments, trailer locations, move status |
| WATT workstation data | Node current_hc, actual rates (live performance) |
| STEM scan rates | Node actual throughput (real vs engineered) |
| QBCC chute state | Downstream capacity constraints |

The mapper is a lookup table, not code logic. It says: "WATT process name 'AR Induct' maps to graph node 'ar_induct'." Different sites have different process names but the mapping is simple configuration.

## 9. AI Layer Contract

The AI receives:

```json
{
  "graph_state": { /* populated graph with live data */ },
  "engine_recommendation": { /* deterministic optimal allocation */ },
  "validation_result": { /* all constraints pass/fail */ },
  "wip_projection": { /* trend over next hour */ },
  "trailer_timeline": { /* when each drains, what arrives */ },
  "mode": "racecar | boat",
  "user_question": "optimize" | "what if..." | free text
}
```

The AI returns:

```json
{
  "explanation": "Natural language summary of the plan",
  "phased_adjustments": [ /* when to move people as conditions change */ ],
  "risks": [ /* flagged concerns with time-to-threshold */ ],
  "alternatives": [ /* if user wants options */ ]
}
```

The AI NEVER does the math. It receives the math already done and adds judgment, phasing, and explanation.

## 10. User Interface

### 10.1 Graph Builder (future — site onboarding)
- Visual drag-and-drop: create nodes, draw edges
- Set rates and constraints per node
- Save as site graph JSON

### 10.2 Optimizer Panel (current Hydra AI, evolved)
- Input fields for user-set values (HC, targets, mode toggle)
- Auto-refresh from live APIs
- One-click optimize
- Output: HC allocation table, flow rates, timeline, risk flags
- Chat for follow-up questions and what-if scenarios

## 11. Implementation Phases

| Phase | Deliverable | Effort | Proves |
|---|---|---|---|
| 1 | Graph schema + ORD9 defined as graph | 3 hrs | Model works |
| 2 | JS graph engine (flow calc + bottleneck + validation) | 8 hrs | Math is deterministic |
| 3 | Data mapper for ORD9 (APIs → graph nodes) | 4 hrs | Live data populates graph |
| 4 | AI layer receives engine output instead of raw data | 3 hrs | AI does judgment, not math |
| 5 | MDW5 defined as graph (second topology) | 2 hrs | Model is universal |
| 6 | Graph builder UI | 10 hrs | Any site self-onboards |
| 7 | Outcome logging + feedback loop | 4 hrs | System improves over time |

**Total to universal v1: ~34 hours**

## 12. Success Metrics

| Metric | Target |
|---|---|
| Time to produce staffing plan | < 30 seconds (vs 5+ min manual) |
| Plan accuracy (AI follows constraints) | > 95% (vs current ~80%) |
| TPH improvement vs manual planning | > 5% measurable delta |
| Sites onboarded without code changes | 2+ in first month |
| User adoption (daily active) | 10+ operators within 60 days |

## 13. Future State

The engine becomes the foundation for:
- **Autonomous rebalancing** — detects bottlenecks and recommends moves without user request
- **Shift pre-planning** — given manifest, produce full-shift staffing timeline before shift starts
- **VTO/VET optimization** — "you can release 4 people at 02:00 without TPH impact"
- **Network-level visibility** — regionals see which sites are optimally staffed vs which have slack
- **Training simulator** — new AMs input scenarios and see how the engine solves them

---

*Document version: 1.0*
*Author: eddobrev*
*Date: July 14, 2026*
