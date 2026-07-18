// ==UserScript==
// @name         Hydra Engine
// @version      0.1
// @description  AI-powered pipeline optimization engine for NASC sort centers
// @author       eddobrev
// @updateURL    https://code.amazon.com/packages/HydraUserscript/blobs/mainline/--/HydraEngine.meta.js?raw=1
// @downloadURL  https://code.amazon.com/packages/HydraUserscript/blobs/mainline/--/HydraEngine.user.js?raw=1
// @match        https://admin.faststart.ats.amazon.dev/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      trans-logistics.amazon.com
// @connect      na.prod.wattwebsite.sorttech.amazon.dev
// @connect      stem-na.corp.amazon.com
// @connect      code.amazon.com
// @connect      *
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 1: CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════

    var ENGINE_VERSION = '0.1';
    var HYDRA_TEXT_LOGO = 'data:image/png;base64,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';
    var GOLD_DRAGON_ICON = 'data:image/png;base64,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';
    var AI_SERVER_URLS = [
        'https://ds-l013ue9b--7077.us-east-1.prod.proxy.devspaces.amazon.dev',
        'https://ds-c9x9n6fd--7077.us-east-1.prod.proxy.devspaces.amazon.dev'
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 2: DATA LAYER (API wrappers — swap for fetch() in webapp)
    // ═══════════════════════════════════════════════════════════════════════════

    // CSRF token for SSP/WATT calls
    var csrfToken = null;

    function fetchToken() {
        // TODO: fetch CSRF token from trans-logistics
        return Promise.resolve();
    }

    function fetchIBData(node) {
        // TODO: pull inbound trailer data from SSP
        // Returns: array of trailer objects {vrid, route, status, total, sortable, containerized, fluid, noncon, eta, location}
        return Promise.resolve([]);
    }

    function fetchWATTData(node) {
        // TODO: pull workstation/associate data from WATT
        // Returns: {associates, scanRates, inductRates, processPathCounts}
        return Promise.resolve({});
    }

    function fetchSTEMData(node) {
        // TODO: pull WIP and flow data from STEM
        // Returns: {wip, scanRate5m, inductRate5m, arFlow5m}
        return Promise.resolve({});
    }

    function fetchYMSData(node) {
        // TODO: pull yard state from YMS
        // Returns: array of door states
        return Promise.resolve([]);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 3: GRAPH ENGINE (deterministic — no DOM, no GM_ calls)
    // ═══════════════════════════════════════════════════════════════════════════

    // Graph data model
    var graph = {
        nodes: {},      // id → node
        edges: [],      // flow connections
        wipPools: {},   // id → WIP pool
        sources: {},    // id → source (trailers)
        output: null    // TPH definition
    };

    function createNode(id, name, ratePer5min, opts) {
        opts = opts || {};
        return {
            id: id,
            name: name,
            ratePer5min: ratePer5min,
            minHC: opts.minHC || 0,
            maxHC: opts.maxHC || 999,
            currentHC: 0,
            constraints: opts.constraints || [],
            volumeAvailable: 0,
            isFlowHC: opts.isFlowHC !== false // defaults to true
        };
    }

    function createEdge(fromId, toId, split, label) {
        return { from: fromId, to: toId, split: split || 1.0, label: label || '' };
    }

    function createWIPPool(id, name, currentLevel) {
        return {
            id: id,
            name: name,
            currentLevel: currentLevel || 0,
            thresholds: { dangerLow: 15, idealLow: 30, idealHigh: 60 }
        };
    }

    function createOutput(id, formula, components) {
        return { id: id, formula: formula, components: components };
    }

    // ─── Graph Builder ───────────────────────────────────────────────────────

    function buildGraph(definition) {
        // Reset
        graph.nodes = {};
        graph.edges = [];
        graph.wipPools = {};
        graph.sources = {};
        graph.output = null;

        // Build nodes
        definition.nodes.forEach(function(n) {
            graph.nodes[n.id] = createNode(n.id, n.name, n.ratePer5min, n);
        });

        // Build edges
        definition.edges.forEach(function(e) {
            graph.edges.push(createEdge(e.from, e.to, e.split, e.label));
        });

        // Build WIP pools
        definition.wipPools.forEach(function(w) {
            graph.wipPools[w.id] = createWIPPool(w.id, w.name, w.currentLevel);
        });

        // Build output
        if (definition.output) {
            graph.output = createOutput(definition.output.id, definition.output.formula, definition.output.components);
        }

        return graph;
    }

    // ─── ORD9 Graph Definition ───────────────────────────────────────────────

    var ORD9_GRAPH = {
        nodes: [
            { id: 'container_unload', name: 'Container Unload', ratePer5min: 600, minHC: 6, maxHC: 6, constraints: ['fixed_crew'] },
            { id: 'fluid_unload', name: 'Fluid Unload (Small Box)', ratePer5min: 67, minHC: 0, maxHC: 20, constraints: ['max_2_per_trailer', 'spread_first'] },
            { id: 'bb_unload', name: 'Big Box Unload', ratePer5min: 25, minHC: 0, maxHC: 20, constraints: ['exactly_2_per_trailer'] },
            { id: 'ar_induct', name: 'AR Induct', ratePer5min: 33, minHC: 3, maxHC: 20 },
            { id: 'robin_induct', name: 'Robin Induct', ratePer5min: 600, minHC: 0, maxHC: 0, isFlowHC: false }, // HC covered by container_unload
            { id: 'scanner', name: 'Scanner', ratePer5min: 10, minHC: 0, maxHC: 999 }
        ],
        edges: [
            { from: 'fluid_unload', to: 'ar_induct', split: 1.0, label: 'sortable fluid' },
            { from: 'bb_unload', to: 'ar_induct', split: 0.75, label: 'BB sortable' },
            { from: 'bb_unload', to: 'nc_output', split: 0.25, label: 'NC flow' },
            { from: 'container_unload', to: 'robin_induct', split: 1.0, label: 'containerized' },
            { from: 'ar_induct', to: 'mezz_wip', split: 1.0, label: 'inducted' },
            { from: 'robin_induct', to: 'mezz_wip', split: 0.5, label: 'robin → WIP' },  // remainder after AR flow
            { from: 'robin_induct', to: 'ar_flow', split: 0.5, label: 'direct-to-container' },
            { from: 'mezz_wip', to: 'scanner', split: 1.0, label: 'WIP → scan' }
        ],
        wipPools: [
            { id: 'mezz_wip', name: 'Mezzanine WIP', currentLevel: 0 }
        ],
        output: {
            id: 'tph',
            formula: '(scanner_output + ar_flow) * 12 / total_hc',
            components: ['scanner', 'ar_flow']
        }
    };

    // ─── Flow Calculator ─────────────────────────────────────────────────────

    function getNodeInputFlow(nodeId) {
        // Sum of all edges feeding this node
        var total = 0;
        graph.edges.forEach(function(e) {
            if (e.to === nodeId) {
                var fromNode = graph.nodes[e.from];
                var fromPool = graph.wipPools[e.from];
                if (fromNode) {
                    var fromOutput = fromNode.currentHC * fromNode.ratePer5min;
                    total += fromOutput * e.split;
                } else if (fromPool) {
                    // WIP pool feeds based on what's available
                    total += Infinity; // WIP can feed as much as scanner can take
                }
            }
        });
        return total;
    }

    function calculateFlows(alloc) {
        // Apply allocation
        Object.keys(alloc).forEach(function(nodeId) {
            if (graph.nodes[nodeId]) {
                graph.nodes[nodeId].currentHC = alloc[nodeId];
            }
        });

        var flows = {};
        Object.keys(graph.nodes).forEach(function(nodeId) {
            var node = graph.nodes[nodeId];
            var capacity = node.currentHC * node.ratePer5min;
            var inputFlow = getNodeInputFlow(nodeId);
            var actualFlow = Math.min(capacity, inputFlow);

            flows[nodeId] = {
                capacity: capacity,
                inputFlow: inputFlow === Infinity ? capacity : inputFlow,
                actualFlow: actualFlow,
                utilization: capacity > 0 ? Math.round(actualFlow / capacity * 100) : 0
            };
        });

        return flows;
    }

    // ─── Constraint Validator ────────────────────────────────────────────────

    function validateConstraints(alloc) {
        var violations = [];
        var totalAllocated = 0;

        Object.keys(alloc).forEach(function(nodeId) {
            var node = graph.nodes[nodeId];
            if (!node) return;
            var hc = alloc[nodeId];
            totalAllocated += hc;

            // Min/max HC
            if (hc < node.minHC) {
                violations.push({ node: nodeId, rule: 'min_hc', msg: node.name + ': ' + hc + ' < min ' + node.minHC });
            }
            if (hc > node.maxHC) {
                violations.push({ node: nodeId, rule: 'max_hc', msg: node.name + ': ' + hc + ' > max ' + node.maxHC });
            }
        });

        // Induct > fluid check
        var flows = calculateFlows(alloc);
        var inductNode = graph.nodes['ar_induct'];
        if (inductNode && flows['ar_induct'] && flows['fluid_unload']) {
            var inductCap = flows['ar_induct'].capacity;
            var fluidFlow = flows['fluid_unload'].actualFlow;
            // Add BB sortable contribution
            if (flows['bb_unload']) {
                fluidFlow += flows['bb_unload'].actualFlow * 0.75;
            }
            if (inductCap < fluidFlow && fluidFlow > 0) {
                violations.push({ node: 'ar_induct', rule: 'induct_gt_fluid', msg: 'Induct capacity (' + inductCap + ') < IB fluid (' + Math.round(fluidFlow) + ') = JAM' });
            }
        }

        return violations;
    }

    // ─── WIP Projector ───────────────────────────────────────────────────────

    function projectWIP(wipId, inputPer5min, outputPer5min, horizonMin) {
        var pool = graph.wipPools[wipId];
        if (!pool) return [];
        var timeline = [];
        var level = pool.currentLevel;
        var segments = Math.ceil(horizonMin / 5);
        for (var i = 0; i <= segments; i++) {
            var minute = i * 5;
            var perScanner = graph.nodes['scanner'] && graph.nodes['scanner'].currentHC > 0
                ? level / (graph.nodes['scanner'].currentHC * graph.nodes['scanner'].ratePer5min) * 5
                : 999;
            var status = perScanner < 15 ? 'danger_low' : perScanner > 60 ? 'danger_high' : 'ideal';
            timeline.push({ minute: minute, level: Math.round(level), minPerScanner: Math.round(perScanner), status: status });
            level += (inputPer5min - outputPer5min);
            if (level < 0) level = 0;
        }
        return timeline;
    }

    // ─── Bottleneck Finder ───────────────────────────────────────────────────

    function findBottleneck(flows) {
        var worst = null;
        var worstUtil = Infinity;
        Object.keys(flows).forEach(function(nodeId) {
            var f = flows[nodeId];
            if (f.capacity > 0 && f.utilization < worstUtil && graph.nodes[nodeId].isFlowHC) {
                worstUtil = f.utilization;
                // Only consider it a bottleneck if input exceeds capacity
                if (f.inputFlow > f.capacity) {
                    worst = { nodeId: nodeId, capacity: f.capacity, demand: f.inputFlow, gap: f.inputFlow - f.capacity };
                }
            }
        });
        return worst;
    }

    // ─── Optimizer ───────────────────────────────────────────────────────────

    function optimize(flowHC, userInputs) {
        var inputs = userInputs || {};
        var totalHC = inputs.totalHC || 0;
        var ncTarget5m = (inputs.ncTarget || 0) / 12;
        var bbRate5m = (inputs.bbUnload || 300) / 12;
        var wipLevel = inputs.currentWIP || 0;
        var arFlow = inputs.arFlow || 0;
        var scanRate5m = (inputs.scanRate || 140) / 12;
        var inductRate5m = (inputs.inductRate || 400) / 12;
        var sbRate5m = (inputs.smUnload || 800) / 12;
        var robinToWIP = 600 - arFlow; // robin contribution to WIP (robin - AR direct)

        // Step A: Lock mandatory
        var containerHC = 6;
        var bbPerTrailer = bbRate5m / 4;
        var bbTrailersNeeded = ncTarget5m > 0 ? Math.ceil(ncTarget5m / bbPerTrailer) : 0;
        var bbHC = bbTrailersNeeded * 2;
        var remaining = flowHC - containerHC - bbHC;

        // Step B: Start all remaining as scanners
        var scanners = remaining;
        var inductors = 3;
        var sbUnloaders = 0;

        // Step C: Determine if WIP can sustain those scanners for the hour
        var scannerOutput = scanners * scanRate5m;
        var minInductOutput = inductors * inductRate5m;
        var wipInput = minInductOutput + robinToWIP;
        var wipDrainPerMin = (scannerOutput - wipInput) / 5;
        var drainTimeMin = wipDrainPerMin > 0 ? wipLevel / wipDrainPerMin : Infinity;

        // Step D: If WIP drains within the hour, add induction to sustain
        if (drainTimeMin < 60 && drainTimeMin > 0) {
            // Need more WIP input — size induction to sustain scanners
            var neededFromInduct = scannerOutput - robinToWIP;
            if (neededFromInduct > 0) {
                inductors = Math.max(3, Math.min(20, Math.ceil(neededFromInduct / inductRate5m)));
                // Size SB to feed those inductors
                var inductCapacity = inductors * inductRate5m;
                var bbSortable = bbTrailersNeeded * bbRate5m * 0.75;
                var fluidNeeded = inductCapacity - bbSortable;
                if (fluidNeeded > 0) {
                    sbUnloaders = Math.ceil(fluidNeeded / sbRate5m);
                }
            }
            scanners = remaining - inductors - sbUnloaders;
        }

        // Clamp
        inductors = Math.max(3, Math.min(20, inductors));
        scanners = Math.max(0, scanners);
        sbUnloaders = Math.max(0, sbUnloaders);

        // Build allocation
        var allocation = {
            container_unload: containerHC,
            fluid_unload: sbUnloaders,
            bb_unload: bbHC,
            ar_induct: inductors,
            scanner: scanners
        };

        // Calculate flows
        var flows = calculateFlows(allocation);

        // Validate and fix violations (iterate)
        var violations = validateConstraints(allocation);
        var iterations = 0;
        while (violations.length > 0 && iterations < 5) {
            violations.forEach(function(v) {
                if (v.rule === 'induct_gt_fluid' && scanners > 0) {
                    scanners--;
                    inductors++;
                    allocation.ar_induct = inductors;
                    allocation.scanner = scanners;
                }
            });
            flows = calculateFlows(allocation);
            violations = validateConstraints(allocation);
            iterations++;
        }

        // Calculate TPH
        var scannerFlow = scanners * scanRate5m;
        var totalFlow = scannerFlow + arFlow;
        var tphTransient = totalHC > 0 ? Math.round((totalFlow * 12) / totalHC * 10) / 10 : 0;

        // Steady state
        var steadyWipInput = (inductors * inductRate5m) + robinToWIP;
        var steadyScannerFlow = Math.min(scanners * scanRate5m, steadyWipInput);
        var steadyTotalFlow = steadyScannerFlow + arFlow;
        var tphSteady = totalHC > 0 ? Math.round((steadyTotalFlow * 12) / totalHC * 10) / 10 : 0;

        // WIP projection
        graph.wipPools['mezz_wip'].currentLevel = wipLevel;
        var wipTimeline = projectWIP('mezz_wip', steadyWipInput, scanners * scanRate5m, 60);

        return {
            allocation: allocation,
            flows: flows,
            violations: violations,
            tph: { transient: tphTransient, steadyState: tphSteady },
            wipTimeline: wipTimeline,
            meta: {
                flowHC: flowHC,
                totalHC: totalHC,
                bbTrailersStaffed: bbTrailersNeeded,
                ncFlow5m: bbTrailersNeeded * bbPerTrailer,
                wipDelta: Math.round(steadyWipInput - (scanners * scanRate5m))
            }
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 4: DATA MAPPER (API responses → graph nodes)
    // ═══════════════════════════════════════════════════════════════════════════

    function mapIBDataToGraph(ibData, graph) {
        // TODO: map trailer data to source nodes
        // Classify: container, small box, big box
        // Set volumeAvailable on relevant nodes
    }

    function mapWATTDataToGraph(wattData, graph) {
        // TODO: map current HC assignments to graph nodes
        // Set currentHC, actual rates
    }

    function mapSTEMDataToGraph(stemData, graph) {
        // TODO: map WIP levels and flow rates to graph
        // Set wipPool.currentLevel, actual rates
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 5: AI CLIENT (judgment + explanation layer)
    // ═══════════════════════════════════════════════════════════════════════════

    function aiRequest(engineResult, userQuestion, callback) {
        // TODO: send engine result + question to AI server
        // AI receives pre-calculated math, adds judgment/explanation
        // callback(response)
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION 6: UI (disposable — gets rebuilt for webapp)
    // ═══════════════════════════════════════════════════════════════════════════

    function createPanel() {

    function savePanelGeometry() {
        var panel = document.getElementById('hydra-engine-panel');
        if (!panel) return;
        var geo = { left: panel.style.left, top: panel.style.top, width: panel.style.width, height: panel.style.height, transform: panel.style.transform };
        GM_setValue('he-panel-geo', geo);
    }

    function restorePanelGeometry() {
        var panel = document.getElementById('hydra-engine-panel');
        if (!panel) return;
        var geo = GM_getValue('he-panel-geo', null);
        if (geo) {
            if (geo.left) { panel.style.left = geo.left; panel.style.top = geo.top; panel.style.transform = 'none'; }
            if (geo.width) panel.style.width = geo.width;
            if (geo.height) panel.style.height = geo.height;
        }
    }

        // Inject CSS for FAB and panel
        var style = document.createElement('style');
        style.textContent =
            '#he-fab{position:fixed;top:6px;right:18px;z-index:99999;background:linear-gradient(#0d1117,#0d1117) padding-box,linear-gradient(135deg,#ff3030 0%,#ff2060 25%,#a020b8 50%,#2060d8 75%,#20c8f0 100%) border-box;border:2px solid transparent;border-radius:8px;padding:0;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.5),0 0 12px rgba(255,48,48,0.4),0 0 12px rgba(32,200,240,0.35);display:inline-flex;align-items:center;justify-content:center;transition:all .2s;line-height:0}' +
            '#he-fab:hover{transform:scale(1.06);box-shadow:0 4px 18px rgba(0,0,0,.6),0 0 18px rgba(255,48,48,0.6),0 0 18px rgba(32,200,240,0.55);filter:brightness(1.08)}' +
            '#hydra-engine-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:80vh;min-width:400px;min-height:300px;z-index:99990;background:#0d1117;display:none;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#e6edf3;box-shadow:0 8px 40px rgba(0,0,0,.8),0 0 0 1px rgba(48,54,61,.8);border-radius:10px;overflow:visible}' +
            '#hydra-engine-panel.open{display:flex}';
        document.head.appendChild(style);

        // FAB button (top-right, same style as Hydra)
        var fab = document.createElement('div');
        fab.id = 'he-fab';
        fab.innerHTML = '<img src="' + HYDRA_TEXT_LOGO + '" alt="Hydra" style="height:28px;width:auto;display:block;padding:1px 2px;filter:drop-shadow(0 0 8px rgba(255,255,255,0.5));">';
        document.body.appendChild(fab);

        // Dragon logo in panel header (not floating)

        // Slide-out panel
        var panel = document.createElement('div');
        panel.id = 'hydra-engine-panel';
        panel.innerHTML =
            // Header - gradient bar with HYDRA logo in bordered pill (same as #hydra-fab in main Hydra)
            '<div style="height:19px;background:linear-gradient(90deg,#d01818 0%,#c01830 10%,#a81845 20%,#8e1a60 30%,#7a1880 38%,#8020a0 44%,#9020b0 48%,#a020b8 50%,#9028c0 52%,#8030c8 56%,#6040d0 62%,#4050d8 70%,#2868d8 80%,#1890e0 90%,#10b8ee 100%);cursor:move;position:relative;border-radius:10px 10px 0 0;flex-shrink:0" id="he-header">' +
                '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(#0d1117,#0d1117) padding-box,linear-gradient(135deg,#ff3030 0%,#ff2060 25%,#a020b8 50%,#2060d8 75%,#20c8f0 100%) border-box;border:3px solid transparent;border-radius:8px;padding:0;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.5),0 0 12px rgba(255,48,48,0.4),0 0 12px rgba(32,200,240,0.35);line-height:0;z-index:1">' +
                    '<img src="' + GOLD_DRAGON_ICON + '" alt="Hydra" style="height:43px;width:auto;display:block;padding:0;filter:drop-shadow(0 0 8px rgba(255,255,255,0.5));border-radius:5px">' +
                '</div>' +
                '<button id="he-close" style="position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:4px 8px;opacity:0.8" title="Close">✕</button>' +
            '</div>' +
            // Tab bar
            '<div style="display:flex;background:#161b22;border-bottom:1px solid #30363d">' +
                '<button class="he-tab active" data-tab="build" style="flex:1;padding:10px 0;background:none;border:none;border-bottom:2px solid #a020b8;color:#e6edf3;font-size:13px;font-weight:600;cursor:pointer">Build</button>' +
                '<button class="he-tab" data-tab="plan" style="flex:1;padding:10px 0;background:none;border:none;border-bottom:2px solid transparent;color:#8b949e;font-size:13px;font-weight:600;cursor:pointer">Plan</button>' +
                '<button class="he-tab" data-tab="execute" style="flex:1;padding:10px 0;background:none;border:none;border-bottom:2px solid transparent;color:#8b949e;font-size:13px;font-weight:600;cursor:pointer">Execute</button>' +
                '<button class="he-tab" data-tab="report" style="flex:1;padding:10px 0;background:none;border:none;border-bottom:2px solid transparent;color:#8b949e;font-size:13px;font-weight:600;cursor:pointer">Report</button>' +
            '</div>' +
            // Tab content
            '<div id="he-tab-build" class="he-tab-content" style="flex:1;overflow:hidden;display:flex">' +
                // Left panel - Settings list
                '<div style="width:200px;min-width:200px;border-right:1px solid #30363d;overflow-y:auto;padding:12px 0">' +
                    '<div style="padding:4px 16px;font-size:10px;text-transform:uppercase;color:#8b949e;letter-spacing:1px;margin-bottom:4px">Settings</div>' +
                    '<div class="he-setting-item" data-setting="site-code" style="padding:8px 16px;font-size:12px;color:#e6edf3;cursor:pointer;border-left:3px solid transparent;display:flex;justify-content:space-between;align-items:center">Site Code <span id="he-site-display" style="font-size:10px;color:#8b949e;font-weight:600">' + (engineSettings.siteCode || '—') + '</span></div>' +
                    '<div class="he-setting-item" data-setting="presets" style="padding:8px 16px;font-size:12px;color:#e6edf3;cursor:pointer;border-left:3px solid transparent">Presets</div>' +
                    '<div class="he-setting-item" data-setting="sort-times" style="padding:8px 16px;font-size:12px;color:#e6edf3;cursor:pointer;border-left:3px solid transparent">Sort Times</div>' +
                    '<div class="he-setting-item" data-setting="plan-mode" style="padding:8px 16px;font-size:12px;color:#e6edf3;cursor:pointer;border-left:3px solid transparent">Plan Mode</div>' +
                    '<div class="he-setting-item" data-setting="mhe-type-list" style="padding:8px 16px;font-size:12px;color:#e6edf3;cursor:pointer;border-left:3px solid transparent">MHE Type List</div>' +
                    '<div class="he-setting-item" data-setting="mhe-type-attrs" style="padding:8px 16px;font-size:12px;color:#e6edf3;cursor:pointer;border-left:3px solid transparent">MHE Type Attributes</div>' +
                    '<div class="he-setting-item" data-setting="volume-mix" style="padding:8px 16px;font-size:12px;color:#e6edf3;cursor:pointer;border-left:3px solid transparent">Volume Mix</div>' +
                    '<div class="he-setting-item" data-setting="engineer-rates" style="padding:8px 16px;font-size:12px;color:#e6edf3;cursor:pointer;border-left:3px solid transparent">Engineer Rates</div>' +
                '</div>' +
                // Right panel - Groups / Roles
                '<div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column">' +
                    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                        '<span style="font-size:12px;font-weight:600;color:#e6edf3">Groups / Roles</span>' +
                        '<button id="he-add-group" style="padding:4px 10px;background:#1f6feb;color:#fff;border:none;border-radius:4px;font-size:11px;cursor:pointer">+ Add Group</button>' +
                    '</div>' +
                    '<div id="he-groups-list" style="flex:1;overflow-y:auto"></div>' +
                '</div>' +
            '</div>' +
            '<div id="he-tab-plan" class="he-tab-content" style="flex:1;overflow:hidden;display:none">' +
                // Left panel - Sort Details & KPIs
                '<div style="width:340px;min-width:340px;border-right:1px solid #30363d;overflow-y:auto;padding:12px">' +
                    '<div id="he-plan-vars-panel"></div>' +
                '</div>' +
                // Right panel - Bottoms Up Planner table
                '<div style="flex:1;overflow-y:auto;padding:16px">' +
                    '<div id="he-plan-table"></div>' +
                '</div>' +
            '</div>' +
            '<div id="he-tab-execute" class="he-tab-content" style="flex:1;overflow-y:auto;padding:20px;display:none">' +
                '<div style="color:#555;text-align:center;width:100%;padding:40px">Execute tab content</div>' +
            '</div>' +
            '<div id="he-tab-report" class="he-tab-content" style="flex:1;overflow-y:auto;padding:20px;display:none">' +
                '<div style="color:#555;text-align:center;width:100%;padding:40px">Report tab content</div>' +
            '</div>';
        document.body.appendChild(panel);
        restorePanelGeometry();

        // FAB click toggles panel
        fab.addEventListener('click', function() {
            panel.classList.toggle('open');
        });

        // Close button
        document.getElementById('he-close').addEventListener('click', function() {
            panel.classList.remove('open');
        });

        // Draggable header
        (function() {
            var header = document.getElementById('he-header');
            var isDragging = false, startX, startY, startLeft, startTop;
            header.addEventListener('mousedown', function(e) {
                if (e.target.id === 'he-close') return;
                isDragging = true;
                var rect = panel.getBoundingClientRect();
                startX = e.clientX; startY = e.clientY;
                startLeft = rect.left; startTop = rect.top;
                panel.style.transform = 'none';
                panel.style.left = rect.left + 'px';
                panel.style.top = rect.top + 'px';
                e.preventDefault();
            });
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                panel.style.left = (startLeft + e.clientX - startX) + 'px';
                panel.style.top = (startTop + e.clientY - startY) + 'px';
            });
            document.addEventListener('mouseup', function() {
                if (isDragging) { isDragging = false; savePanelGeometry(); }
            });
        })();

        // Resizable via bottom-right handle
        (function() {
            var handle = document.createElement('div');
            handle.style.cssText = 'position:absolute;bottom:0;right:0;width:16px;height:16px;cursor:nwse-resize;z-index:2';
            handle.innerHTML = '<svg width="16" height="16" style="opacity:0.4"><path d="M14 16L16 14M10 16L16 10M6 16L16 6" stroke="#8b949e" stroke-width="1.5"/></svg>';
            panel.style.position = 'fixed';
            panel.appendChild(handle);
            var isResizing = false, startX, startY, startW, startH;
            handle.addEventListener('mousedown', function(e) {
                isResizing = true;
                var rect = panel.getBoundingClientRect();
                panel.style.transform = 'none';
                panel.style.left = rect.left + 'px';
                panel.style.top = rect.top + 'px';
                startX = e.clientX; startY = e.clientY;
                startW = rect.width; startH = rect.height;
                e.preventDefault(); e.stopPropagation();
            });
            document.addEventListener('mousemove', function(e) {
                if (!isResizing) return;
                panel.style.width = Math.max(400, startW + e.clientX - startX) + 'px';
                panel.style.height = Math.max(300, startH + e.clientY - startY) + 'px';
            });
            document.addEventListener('mouseup', function() { if (isResizing) { isResizing = false; savePanelGeometry(); } });
        })();

        initEventHandlers();
    }

    function renderGroups() {
        if (!engineSettings.groups) engineSettings.groups = [];
        var container = document.getElementById('he-groups-list');
        if (!container) return;
        if (engineSettings.groups.length === 0) {
            container.innerHTML = '<div style="color:#555;text-align:center;padding:30px;font-size:12px">No groups defined yet. Click + Add Group.</div>';
            return;
        }
        var html = '';
        engineSettings.groups.forEach(function(g, gi) {
            html += '<div style="margin-bottom:10px;border:1px solid ' + (g.color || '#30363d') + ';border-radius:6px;overflow:hidden">';
            // Group header
            html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:' + (g.color || '#30363d') + '22">';
            html += '<input type="color" class="he-grp-color" data-gi="' + gi + '" value="' + (g.color || '#6b21a8') + '" style="width:20px;height:20px;border:none;padding:0;cursor:pointer;background:none">';
            html += '<input type="text" class="he-grp-name" data-gi="' + gi + '" value="' + (g.name || '') + '" placeholder="Group name" style="flex:1;padding:3px 6px;background:transparent;border:none;border-bottom:1px solid #30363d;color:#e6edf3;font-size:12px;font-weight:600">';
            html += '<button class="he-grp-add-role" data-gi="' + gi + '" style="padding:2px 6px;background:#1f6feb;border:none;border-radius:3px;color:#fff;font-size:9px;cursor:pointer">+ Role</button>';
            html += '<button class="he-grp-del" data-gi="' + gi + '" style="padding:2px 6px;background:#da3633;border:none;border-radius:3px;color:#fff;font-size:9px;cursor:pointer">✕</button>';
            html += '</div>';
            // Roles
            if (g.roles && g.roles.length > 0) {
                g.roles.forEach(function(r, ri) {
                    var roleName = (typeof r === 'object') ? (r.name || '') : (r || '');
                    var roleFormula = (typeof r === 'object') ? (r.formula || '') : '';
                    var roleGE = (typeof r === 'object') ? (r.geRoles || '') : '';
                    var roleRate = (typeof r === 'object') ? (r.rate || '') : '';
                    // Auto-fill from engineer rates if empty and name matches
                    if (!roleRate && roleName && engineSettings.engineerRates) {
                        var match = engineSettings.engineerRates.find(function(er) { return er.desc === roleName; });
                        if (match) roleRate = match.rate;
                    }
                    var isGE = (engineSettings.planMode === 'golden-eye');
                    html += '<div style="display:flex;align-items:center;gap:6px;padding:4px 10px 4px 30px;border-top:1px solid #21262d">';
                    html += '<input type="text" class="he-role-name" data-gi="' + gi + '" data-ri="' + ri + '" value="' + roleName + '" placeholder="Role name" style="flex:1;padding:3px 6px;background:#0d1117;border:1px solid #30363d;border-radius:3px;color:#e6edf3;font-size:11px">';
                    html += '<input type="text" class="he-role-rate" data-gi="' + gi + '" data-ri="' + ri + '" value="' + roleRate + '" placeholder="Eng Rate" style="width:70px;padding:3px 6px;background:#0d1117;border:1px solid #30363d;border-radius:3px;color:#e6edf3;font-size:11px;text-align:center">';
                    if (isGE) {
                        html += '<button class="he-role-ge" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (roleGE ? '#eab308' : '#30363d') + ';border-radius:3px;color:' + (roleGE ? '#eab308' : '#8b949e') + ';font-size:9px;cursor:pointer;font-weight:600" title="' + (roleGE || 'No GE roles') + '">GE</button>';
                    } else {
                        html += '<button class="he-role-formula" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (roleFormula ? '#2ea043' : '#30363d') + ';border-radius:3px;color:' + (roleFormula ? '#2ea043' : '#8b949e') + ';font-size:9px;cursor:pointer" title="' + (roleFormula || 'No formula') + '">ƒx</button>';
                    }
                    var roleAI = (typeof r === 'object') ? (r.aiRules || '') : '';
                    var roleLocked = (typeof r === 'object') ? (r.locked || false) : false;
                    html += '<button class="he-role-ai" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (roleAI ? '#60a5fa' : '#30363d') + ';border-radius:3px;color:' + (roleAI ? '#60a5fa' : '#8b949e') + ';font-size:9px;cursor:pointer" title="' + (roleAI ? 'AI rules set' : 'No AI rules') + '">AI</button>';
                    var roleStation = (typeof r === 'object') ? (r.station || '') : '';
                    html += '<button class="he-role-station" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (roleStation ? '#f97316' : '#30363d') + ';border-radius:3px;color:' + (roleStation ? '#f97316' : '#8b949e') + ';font-size:9px;cursor:pointer" title="' + (roleStation || 'No station mapping') + '">ST</button>';
                    html += '<button class="he-role-lock" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 6px;background:none;border:1px solid ' + (roleLocked ? '#eab308' : '#30363d') + ';border-radius:3px;color:' + (roleLocked ? '#eab308' : '#8b949e') + ';font-size:9px;cursor:pointer" title="' + (roleLocked ? 'Locked' : 'Dynamic') + '">' + (roleLocked ? '🔒' : '🔓') + '</button>';
                    html += '<button class="he-role-del" data-gi="' + gi + '" data-ri="' + ri + '" style="padding:2px 5px;background:none;border:1px solid #da3633;border-radius:3px;color:#da3633;font-size:9px;cursor:pointer">✕</button>';
                    html += '</div>';
                });
            }
            html += '</div>';
        });
        container.innerHTML = html;
        attachGroupHandlers();
    }

    function collectGroupsFromDOM() {
        if (!engineSettings.groups) return;
        document.querySelectorAll('.he-grp-name').forEach(function(el) {
            var gi = parseInt(el.getAttribute('data-gi'));
            if (engineSettings.groups[gi]) engineSettings.groups[gi].name = el.value.trim();
        });
        document.querySelectorAll('.he-grp-color').forEach(function(el) {
            var gi = parseInt(el.getAttribute('data-gi'));
            if (engineSettings.groups[gi]) engineSettings.groups[gi].color = el.value;
        });
        document.querySelectorAll('.he-role-name').forEach(function(el) {
            var gi = parseInt(el.getAttribute('data-gi'));
            var ri = parseInt(el.getAttribute('data-ri'));
            if (engineSettings.groups[gi] && engineSettings.groups[gi].roles) {
                var existing = engineSettings.groups[gi].roles[ri];
                if (typeof existing === 'object') {
                    existing.name = el.value.trim();
                } else {
                    engineSettings.groups[gi].roles[ri] = { name: el.value.trim(), formula: '' };
                }
            }
        });
        document.querySelectorAll('.he-role-rate').forEach(function(el) {
            var gi = parseInt(el.getAttribute('data-gi'));
            var ri = parseInt(el.getAttribute('data-ri'));
            if (engineSettings.groups[gi] && engineSettings.groups[gi].roles) {
                var existing = engineSettings.groups[gi].roles[ri];
                if (typeof existing === 'object') { existing.rate = el.value.trim(); }
            }
        });
    }

    function attachGroupHandlers() {
        // Color/name changes save on blur
        document.querySelectorAll('.he-grp-name,.he-grp-color,.he-role-name,.he-role-rate').forEach(function(el) {
            el.addEventListener('change', function() { collectGroupsFromDOM(); saveSettings(); });
        });
        // Auto-fill eng rate when role name matches
        document.querySelectorAll('.he-role-name').forEach(function(el) {
            el.addEventListener('change', function() {
                var name = el.value.trim();
                if (!name || !engineSettings.engineerRates) return;
                var match = engineSettings.engineerRates.find(function(er) { return er.desc === name; });
                if (match) {
                    var gi = el.getAttribute('data-gi');
                    var ri = el.getAttribute('data-ri');
                    var rateEl = document.querySelector('.he-role-rate[data-gi="' + gi + '"][data-ri="' + ri + '"]');
                    if (rateEl) {
                        rateEl.value = match.rate;
                        collectGroupsFromDOM(); saveSettings();
                    }
                }
            });
        });
        // Add role
        document.querySelectorAll('.he-grp-add-role').forEach(function(btn) {
            btn.addEventListener('click', function() {
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                if (!engineSettings.groups[gi].roles) engineSettings.groups[gi].roles = [];
                engineSettings.groups[gi].roles.push({ name: '', formula: '', rate: '', geRoles: '', aiRules: '', station: '', locked: true, area: '', variable: '' });
                saveSettings(); renderGroups();
            });
        });
        // Delete group
        document.querySelectorAll('.he-grp-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                engineSettings.groups.splice(gi, 1);
                saveSettings(); renderGroups();
            });
        });
        // Delete role
        // AI rules button
        document.querySelectorAll('.he-role-ai').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                var role = engineSettings.groups[gi].roles[ri];
                if (typeof role !== 'object') role = { name: role || '', formula: '', geRoles: '', aiRules: '', locked: false };
                openAIRulesModal(gi, ri, role);
            });
        });
        // Lock/Dynamic toggle
        // Station mapping button
        document.querySelectorAll('.he-role-station').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                var role = engineSettings.groups[gi].roles[ri];
                if (typeof role !== 'object') role = { name: role || '', formula: '', geRoles: '', aiRules: '', station: '', locked: false };
                openStationModal(gi, ri, role);
            });
        });
        document.querySelectorAll('.he-role-lock').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                if (typeof engineSettings.groups[gi].roles[ri] !== 'object') {
                    engineSettings.groups[gi].roles[ri] = { name: engineSettings.groups[gi].roles[ri] || '', formula: '', geRoles: '', aiRules: '', locked: false };
                }
                engineSettings.groups[gi].roles[ri].locked = !engineSettings.groups[gi].roles[ri].locked;
                saveSettings();
                renderGroups();
            });
        });
        // GE roles button
        document.querySelectorAll('.he-role-ge').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                var role = engineSettings.groups[gi].roles[ri];
                if (typeof role !== 'object') role = { name: role || '', formula: '', geRoles: '' };
                openGERolesModal(gi, ri, role);
            });
        });
        // Formula button
        document.querySelectorAll('.he-role-formula').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                var role = engineSettings.groups[gi].roles[ri];
                if (typeof role !== 'object') role = { name: role || '', formula: '' };
                openFormulaModal(gi, ri, role);
            });
        });
        document.querySelectorAll('.he-role-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                collectGroupsFromDOM();
                var gi = parseInt(btn.getAttribute('data-gi'));
                var ri = parseInt(btn.getAttribute('data-ri'));
                engineSettings.groups[gi].roles.splice(ri, 1);
                saveSettings(); renderGroups();
            });
        });
    }

    function openStationModal(gi, ri, role) {
        var existing = document.getElementById('he-station-modal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'he-station-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:#161b22;border:1px solid #30363d;border-radius:10px;padding:20px;min-width:380px;max-width:520px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                    '<span style="font-size:14px;font-weight:600;color:#e6edf3">Station Mapping: ' + (role.name || 'Unnamed') + '</span>' +
                    '<button id="he-station-close" style="background:none;border:none;color:#8b949e;font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div style="margin-bottom:10px;color:#8b949e;font-size:11px">Enter the station/process segment names that map to this role (comma or space separated):</div>' +
                '<textarea id="he-station-input" style="width:100%;height:80px;padding:10px;background:#0d1117;border:1px solid #30363d;border-radius:6px;color:#e6edf3;font-family:-apple-system,sans-serif;font-size:12px;resize:vertical" placeholder="e.g. AR Induct, AR Container Build Lane 6/7, AR Waterspider">' + (role.station || '') + '</textarea>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">' +
                    '<button id="he-station-cancel" style="padding:6px 14px;background:none;border:1px solid #30363d;border-radius:6px;color:#8b949e;font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-station-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('he-station-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-station-cancel').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.getElementById('he-station-save').addEventListener('click', function() {
            var val = document.getElementById('he-station-input').value.trim();
            if (typeof engineSettings.groups[gi].roles[ri] !== 'object') {
                engineSettings.groups[gi].roles[ri] = { name: '', formula: '', geRoles: '', aiRules: '', station: '', locked: false };
            }
            engineSettings.groups[gi].roles[ri].station = val;
            saveSettings();
            modal.remove();
            renderGroups();
        });
    }

    function openAIRulesModal(gi, ri, role) {
        var existing = document.getElementById('he-ai-modal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'he-ai-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:#161b22;border:1px solid #30363d;border-radius:10px;padding:20px;min-width:380px;max-width:520px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                    '<span style="font-size:14px;font-weight:600;color:#e6edf3">AI Rules: ' + (role.name || 'Unnamed') + '</span>' +
                    '<button id="he-ai-close" style="background:none;border:none;color:#8b949e;font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div style="margin-bottom:10px;color:#8b949e;font-size:11px">Enter rules for the AI to follow when allocating headcount for this role. One rule per line.</div>' +
                '<textarea id="he-ai-input" style="width:100%;height:120px;padding:10px;background:#0d1117;border:1px solid #30363d;border-radius:6px;color:#e6edf3;font-family:-apple-system,sans-serif;font-size:12px;resize:vertical" placeholder="e.g.\nMinimum 2 HC at all times\nScale with volume above 5000 TPH\nDo not exceed 8 HC">' + (role.aiRules || '') + '</textarea>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">' +
                    '<button id="he-ai-cancel" style="padding:6px 14px;background:none;border:1px solid #30363d;border-radius:6px;color:#8b949e;font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-ai-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('he-ai-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-ai-cancel').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.getElementById('he-ai-save').addEventListener('click', function() {
            var val = document.getElementById('he-ai-input').value.trim();
            if (typeof engineSettings.groups[gi].roles[ri] !== 'object') {
                engineSettings.groups[gi].roles[ri] = { name: '', formula: '', geRoles: '', aiRules: '', locked: false };
            }
            engineSettings.groups[gi].roles[ri].aiRules = val;
            saveSettings();
            modal.remove();
            renderGroups();
        });
    }

    function openGERolesModal(gi, ri, role) {
        var existing = document.getElementById('he-ge-modal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'he-ge-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:#161b22;border:1px solid #30363d;border-radius:10px;padding:20px;min-width:350px;max-width:500px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                    '<span style="font-size:14px;font-weight:600;color:#e6edf3">Golden Eye Roles: ' + (role.name || 'Unnamed') + '</span>' +
                    '<button id="he-ge-close" style="background:none;border:none;color:#8b949e;font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div style="margin-bottom:10px;color:#8b949e;font-size:11px">Enter Golden Eye role names, separated by commas or spaces:</div>' +
                '<textarea id="he-ge-input" style="width:100%;height:80px;padding:10px;background:#0d1117;border:1px solid #30363d;border-radius:6px;color:#e6edf3;font-family:-apple-system,sans-serif;font-size:12px;resize:vertical" placeholder="e.g. Cont. Unload, Shuttle Dump, Jam Breaker">' + (role.geRoles || '') + '</textarea>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">' +
                    '<button id="he-ge-cancel" style="padding:6px 14px;background:none;border:1px solid #30363d;border-radius:6px;color:#8b949e;font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-ge-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('he-ge-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-ge-cancel').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.getElementById('he-ge-save').addEventListener('click', function() {
            var val = document.getElementById('he-ge-input').value.trim();
            if (typeof engineSettings.groups[gi].roles[ri] !== 'object') {
                engineSettings.groups[gi].roles[ri] = { name: '', formula: '', geRoles: '' };
            }
            engineSettings.groups[gi].roles[ri].geRoles = val;
            saveSettings();
            modal.remove();
            renderGroups();
        });
    }

    function getFormulaVariables() {
        var vars = ['volume', 'sortLength', 'totalHC', 'engRate'];
        // Add MHE type-based variables from attributes
        var attrs = ['Hourly Throughput','Container Build %','Fluid Load %','Direct to Container %',
            'Shuttle Volume %','Pallet Volume %','Cart Volume %','Bag Volume %',
            'Chute - Lanes Volume %','Chute - OB Volume %','Runout Volume %',
            'Packages per Shuttle','Packages per Pallet','Packages per Cart','Packages per Bag'];
        if (engineSettings.mheTypes) {
            engineSettings.mheTypes.forEach(function(mhe) {
                attrs.forEach(function(attr) {
                    vars.push(mhe.replace(/\s+/g,'-') + '-' + attr.replace(/[\s%]+/g,'-').replace(/-+$/,''));
                });
            });
        }
        return vars;
    }

    // Resolve a formula variable name to its current numeric value
    function resolveFormulaVarValue(varName) {
        var pv = engineSettings.planVars || {};
        if (varName === 'volume') return parseFloat(pv.sortVolumeGoal) || 0;
        if (varName === 'sortLength') return parseFloat(pv.operationalLength) || 0;
        if (varName === 'totalHC') return 0; // reserved, not yet wired to live headcount
        if (varName === 'engRate') return 0; // per-role engRate is substituted separately when evaluating a role's own formula
        // MHE-type-attribute vars: "MHEType-Attribute-Slug"
        if (engineSettings.mheTypes) {
            var attrs = ['Hourly Throughput','Container Build %','Fluid Load %','Direct to Container %',
                'Shuttle Volume %','Pallet Volume %','Cart Volume %','Bag Volume %',
                'Chute - Lanes Volume %','Chute - OB Volume %','Runout Volume %',
                'Packages per Shuttle','Packages per Pallet','Packages per Cart','Packages per Bag'];
            for (var i = 0; i < engineSettings.mheTypes.length; i++) {
                var mhe = engineSettings.mheTypes[i];
                var mheSlug = mhe.replace(/\s+/g, '-');
                for (var j = 0; j < attrs.length; j++) {
                    var attr = attrs[j];
                    var slug = mheSlug + '-' + attr.replace(/[\s%]+/g, '-').replace(/-+$/, '');
                    if (slug === varName) {
                        var key = mhe + '|' + attr;
                        var raw = (engineSettings.mheAttrs && engineSettings.mheAttrs[key]) || '0';
                        var num = parseFloat(raw) || 0;
                        // Percent-style attributes are stored as whole numbers (e.g. 87 for 87%); convert to fraction
                        if (attr.indexOf('%') !== -1) return num / 100;
                        return num;
                    }
                }
            }
        }
        return 0;
    }

    // Evaluate a role's formula string, substituting variables with live values.
    // engRate resolves to the role's own Eng Rate. Returns NaN if evaluation fails.
    function evaluateRoleFormula(formula, role) {
        if (!formula) return 0;
        var allVars = getFormulaVariables();
        // Sort variable names longest-first so prefixes don't clobber longer matches
        var sorted = allVars.slice().sort(function(a, b) { return b.length - a.length; });
        var expr = formula;
        sorted.forEach(function(v) {
            var val = (v === 'engRate') ? (parseFloat(role && role.rate) || 0) : resolveFormulaVarValue(v);
            expr = expr.replace(new RegExp(v.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '(' + val + ')');
        });
        try {
            var result = Function('"use strict"; return (' + expr + ')')();
            return (typeof result === 'number' && !isNaN(result)) ? result : NaN;
        } catch (e) {
            return NaN;
        }
    }

    function renderPlanTab() {
        renderPlanVarsPanel();
        renderPlanTable();
    }

    // Field definitions for the "Sort Details & KPIs" planning variables panel.
    // All values are hardcoded/manual inputs (no calculated fields).
    var PLAN_KPI_FIELDS = [
        { key: 'sortVolumeGoal', label: 'Sort Volume Goal' },
        { key: 'sortNonConVolumeGoal', label: 'Sort Non-Con Volume Goal' },
        { key: 'operationalLength', label: 'Operational Length' },
        { key: 'startUpBreak', label: 'Start Up & Break' },
        { key: 'laborPlanTPH', label: 'Labor Plan TPH' },
        { key: 'laborPlanHC', label: 'Labor Plan HC' },
        { key: 'sspotHC', label: 'SSPOT HC' },
        { key: 'attendanceAssumption', label: 'Sort Attendance Assumption' },
        { key: 'expectedAttendance', label: 'Expected Attendance' },
        { key: 'bottomsUpHC', label: 'Bottoms Up HC' },
        { key: 'bottomsUpTPH', label: 'Bottoms Up TPH' },
        { key: 'vtoVet', label: 'VTO / VET' }
    ];
    var PLAN_MISC_FIELDS = [
        { key: 'problemSolvePct', label: 'Problem Solve %' },
        { key: 'problemSolve', label: 'Problem Solve' },
        { key: 'jackpotPct', label: 'Jackpot %' },
        { key: 'jackpotVolume', label: 'Jackpot Volume' },
        { key: 'nonConPct', label: 'Non-Con %' },
        { key: 'nonConPlusPct', label: 'Non-Con Plus %' }
    ];
    var PLAN_ALPS_FIELDS = [
        { key: 'alpsAttendancePct', label: 'Attendance %' },
        { key: 'alpsTPH', label: 'TPH' },
        { key: 'alpsPlannedHC', label: 'Planned HC' },
        { key: 'alpsForecastVolume', label: 'Forecast volume' }
    ];
    var PLAN_SIZE_KEYS = [
        { key: 'extraSmall', label: 'Extra Small' },
        { key: 'small', label: 'Small' },
        { key: 'medium', label: 'Medium' },
        { key: 'large', label: 'Large' },
        { key: 'extraLarge', label: 'Extra Large' },
        { key: 'nonCon', label: 'Non-Con' },
        { key: 'nonConPlus', label: 'Non-Con +' }
    ];

    function renderPlanVarsPanel() {
        var container = document.getElementById('he-plan-vars-panel');
        if (!container) return;
        if (!engineSettings.planVars) engineSettings.planVars = {};
        if (!engineSettings.packageBreakdown) {
            engineSettings.packageBreakdown = { extraSmall: '29.37', small: '19.73', medium: '17.91', large: '18.09', extraLarge: '8.63', nonCon: '3.45', nonConPlus: '2.83' };
        }
        var pv = engineSettings.planVars;
        var bd = engineSettings.packageBreakdown;
        var sortVolumeGoal = parseFloat(pv.sortVolumeGoal) || 0;

        var gridBorder = '1px solid #3a3f47';
        var td = function(content, opts) {
            opts = opts || {};
            var style = 'padding:4px 8px;border:' + gridBorder + ';font-size:11px;';
            style += 'text-align:' + (opts.align || 'left') + ';';
            style += 'color:' + (opts.color || '#e6edf3') + ';';
            style += 'background:' + (opts.bg || '#0d1117') + ';';
            if (opts.bold) style += 'font-weight:700;';
            var tag = opts.colspan ? ('<td colspan="' + opts.colspan + '" style="' + style + '">') : ('<td style="' + style + '">');
            return tag + content + '</td>';
        };
        var inputCell = function(key, opts) {
            opts = opts || {};
            var val = pv[key] !== undefined ? pv[key] : '';
            return td('<input type="text" class="he-plankpi" data-key="' + key + '" value="' + val + '" style="width:100%;box-sizing:border-box;padding:2px 4px;background:transparent;border:1px solid transparent;color:' + (opts.color || '#e6edf3') + ';font-size:11px;text-align:right">', {bg: opts.bg || '#0d1117', align: 'right'});
        };

        var html = '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif;margin-bottom:14px">';
        html += '<tr>' + td('Sort Details & KPIs', {bg: '#22272e', color: '#e6edf3', bold: true, colspan: 2, align: 'center'}) + '</tr>';
        PLAN_KPI_FIELDS.forEach(function(f) {
            html += '<tr>' + td(f.label, {}) + inputCell(f.key) + '</tr>';
        });
        html += '</table>';

        // Volume Mix / Packages / Percents table
        html += '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif;margin-bottom:14px">';
        html += '<tr>' + td('Volume Mix', {bg: '#22272e', color: '#e6edf3', bold: true}) + td('Packages', {bg: '#22272e', color: '#e6edf3', bold: true, align: 'right'}) + td('Percents', {bg: '#22272e', color: '#e6edf3', bold: true, align: 'right'}) + '</tr>';
        var totalPct = 0;
        PLAN_SIZE_KEYS.forEach(function(s) {
            var pct = parseFloat(bd[s.key]) || 0;
            totalPct += pct;
            var packages = Math.round(sortVolumeGoal * pct / 100);
            html += '<tr>';
            html += td(s.label, {});
            html += td(packages.toLocaleString(), {align: 'right', bg: '#3d4450', color: '#1a1a1a'});
            html += td(pct.toFixed(2) + '%', {align: 'right', bg: '#3d4450', color: '#1a1a1a'});
            html += '</tr>';
        });
        var totalPackages = Math.round(sortVolumeGoal * totalPct / 100);
        html += '<tr>' + td('Total', {bold: true, extra: ''}) + td(totalPackages.toLocaleString(), {align: 'right', bold: true}) + td(totalPct.toFixed(2) + '%', {align: 'right', bold: true}) + '</tr>';
        html += '</table>';

        // Misc inputs (Problem Solve / Jackpot / Non-Con)
        html += '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif;margin-bottom:14px">';
        PLAN_MISC_FIELDS.forEach(function(f) {
            html += '<tr>' + td(f.label, {}) + inputCell(f.key) + '</tr>';
        });
        html += '</table>';

        // ALPS Plan
        html += '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif">';
        html += '<tr>' + td('ALPS Plan', {bg: '#22272e', color: '#e6edf3', bold: true, colspan: 2, align: 'center'}) + '</tr>';
        PLAN_ALPS_FIELDS.forEach(function(f) {
            html += '<tr>' + td(f.label, {}) + inputCell(f.key) + '</tr>';
        });
        html += '</table>';

        container.innerHTML = html;

        // Wire up KPI inputs
        container.querySelectorAll('.he-plankpi').forEach(function(inp) {
            inp.addEventListener('change', function() {
                var key = inp.getAttribute('data-key');
                engineSettings.planVars[key] = inp.value.trim();
                saveSettings();
                renderPlanTable();
                if (key === 'sortVolumeGoal') renderPlanVarsPanel();
            });
        });
    }

    function renderPlanTable() {
        var container = document.getElementById('he-plan-table');
        if (!container) return;
        if (!engineSettings.groups || engineSettings.groups.length === 0) {
            container.innerHTML = '<div style="color:#555;text-align:center;padding:40px;font-size:12px">No groups/roles defined yet. Add them in the Build tab.</div>';
            return;
        }
        var pv = engineSettings.planVars || {};
        var opLength = parseFloat(pv.operationalLength) || 0;
        var attendance = parseFloat(pv.attendanceAssumption) || 0;
        var attendanceFrac = attendance > 1 ? attendance / 100 : attendance;

        // Excel-like grid styling (dark theme)
        var gridBorder = '1px solid #3a3f47';
        var cellPad = '4px 8px';
        var bgDark = '#0d1117';
        var bgGray = '#c9cdd3';
        var textLight = '#e6edf3';
        var textMuted = '#8b949e';
        var textDarkOnLight = '#1a1a1a';
        var orangeBg = '#f4b183';
        var blueBg = '#9dc3e6';

        var td = function(content, opts) {
            opts = opts || {};
            var style = 'padding:' + cellPad + ';border:' + gridBorder + ';font-size:11px;';
            style += 'text-align:' + (opts.align || 'center') + ';';
            style += 'color:' + (opts.color || textLight) + ';';
            style += 'background:' + (opts.bg || bgDark) + ';';
            if (opts.bold) style += 'font-weight:700;';
            if (opts.extra) style += opts.extra;
            var tag = opts.colspan ? ('<td colspan="' + opts.colspan + '" style="' + style + '">') : ('<td style="' + style + '">');
            return tag + content + '</td>';
        };

        var html = '<table style="width:100%;border-collapse:collapse;font-family:Calibri,Arial,sans-serif">';

        // Super-header row (Volume / Rate / Planned / SARG) - shown once at the very top
        html += '<tr>';
        html += td('Bottoms Up Planner - Grouped by Area', {bg: '#22272e', color: textLight, bold: true, align: 'left', extra: 'text-decoration:underline;'});
        html += td('', {bg: '#22272e'});
        html += td('', {bg: '#22272e'});
        html += td('Volume', {bg: '#22272e', color: textLight, bold: true, colspan: 2, extra: 'text-decoration:underline;'});
        html += td('Rate', {bg: '#22272e', color: textLight, bold: true, colspan: 3, extra: 'text-decoration:underline;'});
        html += td('Planned', {bg: '#22272e', color: textLight, bold: true, colspan: 2, extra: 'text-decoration:underline;'});
        html += td('SARG', {bg: '#22272e', color: textLight, bold: true, extra: 'text-decoration:underline;'});
        html += '</tr>';

        engineSettings.groups.forEach(function(g, gi) {
            var color = g.color || '#30363d';
            // Group header row (colored, acts as both group name banner and column header)
            html += '<tr>';
            html += td(g.name || 'Unnamed Group', {bg: color, color: '#fff', bold: true, align: 'left'});
            html += td('Process Path', {bg: color, color: '#fff', bold: true, align: 'left'});
            html += td('Variable', {bg: color, color: '#fff', bold: true});
            html += td('Total', {bg: color, color: '#fff', bold: true});
            html += td('Hourly', {bg: color, color: '#fff', bold: true});
            html += td('Engineer', {bg: color, color: '#fff', bold: true});
            html += td('Plan', {bg: color, color: '#fff', bold: true});
            html += td('Delta', {bg: color, color: '#fff', bold: true});
            html += td('HC', {bg: color, color: '#fff', bold: true});
            html += td('Hrs', {bg: color, color: '#fff', bold: true});
            html += td('HC', {bg: color, color: '#fff', bold: true});
            html += '</tr>';

            if (!g.roles || g.roles.length === 0) return;
            g.roles.forEach(function(r, ri) {
                if (typeof r !== 'object') return;
                var name = r.name || '(unnamed role)';
                var engRate = parseFloat(r.rate) || 0;
                var planRate = (r.planRate !== undefined && r.planRate !== '') ? parseFloat(r.planRate) : engRate;
                if (isNaN(planRate)) planRate = engRate;
                var variable = (r.variable !== undefined && r.variable !== '') ? parseFloat(r.variable) : 1;
                if (isNaN(variable)) variable = 1;
                var hasVariable = (r.variable !== undefined && r.variable !== '');

                var rawTotal = evaluateRoleFormula(r.formula, r);
                var total = isNaN(rawTotal) ? NaN : rawTotal * variable;
                var totalValid = !isNaN(total);
                var hourly = (totalValid && opLength > 0) ? (total / opLength) : NaN;
                var delta = (engRate > 0) ? (planRate / engRate - 1) : NaN;
                var plannedHC = (!isNaN(hourly) && planRate > 0) ? (hourly / planRate) : NaN;
                var plannedHrs = (!isNaN(plannedHC)) ? (plannedHC * opLength) : NaN;
                var sargHC = (!isNaN(plannedHC) && attendanceFrac > 0) ? Math.ceil(plannedHC / attendanceFrac) : NaN;

                // Conditional formatting on Delta: red < 0, green > 0, gray at 0/blank
                var deltaBg = isNaN(delta) ? bgGray : (delta < -0.001 ? '#f8cbad' : (delta > 0.001 ? '#c6e0b4' : bgGray));
                var deltaFg = textDarkOnLight;
                var fmt = function(n, decimals) {
                    if (n === undefined || n === null || isNaN(n)) return '—';
                    return n.toLocaleString(undefined, { minimumFractionDigits: decimals || 0, maximumFractionDigits: decimals || 0 });
                };
                var fmtPct = function(n) { return isNaN(n) ? '—' : (n >= 0 ? '+' : '') + (n * 100).toFixed(1) + '%'; };

                html += '<tr>';
                html += td('', {});
                html += td(name, {color: textLight, align: 'left'});
                html += td('<input type="text" class="he-plan-variable" data-gi="' + gi + '" data-ri="' + ri + '" value="' + (r.variable || '') + '" placeholder="" style="width:50px;padding:2px 4px;background:transparent;border:1px solid transparent;color:' + textDarkOnLight + ';font-size:11px;text-align:center">', {bg: hasVariable ? orangeBg : bgDark});
                html += td(fmt(total), {bg: bgGray, color: textDarkOnLight});
                html += td(fmt(hourly), {bg: bgGray, color: textDarkOnLight});
                html += td(fmt(engRate), {bg: blueBg, color: textDarkOnLight});
                html += td('<input type="text" class="he-plan-rate" data-gi="' + gi + '" data-ri="' + ri + '" value="' + planRate + '" style="width:56px;padding:2px 4px;background:transparent;border:1px solid transparent;color:' + textDarkOnLight + ';font-size:11px;text-align:center">', {bg: bgGray});
                html += td(fmtPct(delta), {bg: deltaBg, color: deltaFg, bold: true});
                html += td(fmt(plannedHC, 0), {color: textLight});
                html += td(fmt(plannedHrs, 0), {color: textLight});
                html += td(fmt(sargHC), {color: textLight});
                html += '</tr>';
            });
        });
        html += '</table>';
        container.innerHTML = html;

        // Wire up Plan rate / Variable inputs
        container.querySelectorAll('.he-plan-rate').forEach(function(inp) {
            inp.addEventListener('change', function() {
                var gi = parseInt(inp.getAttribute('data-gi'));
                var ri = parseInt(inp.getAttribute('data-ri'));
                var val = inp.value.trim();
                if (engineSettings.groups[gi] && engineSettings.groups[gi].roles[ri]) {
                    engineSettings.groups[gi].roles[ri].planRate = val;
                    saveSettings();
                    renderPlanTable();
                }
            });
        });
        container.querySelectorAll('.he-plan-variable').forEach(function(inp) {
            inp.addEventListener('change', function() {
                var gi = parseInt(inp.getAttribute('data-gi'));
                var ri = parseInt(inp.getAttribute('data-ri'));
                var val = inp.value.trim();
                if (engineSettings.groups[gi] && engineSettings.groups[gi].roles[ri]) {
                    engineSettings.groups[gi].roles[ri].variable = val;
                    saveSettings();
                    renderPlanTable();
                }
            });
        });
    }

    function openFormulaModal(gi, ri, role) {
        var existing = document.getElementById('he-formula-modal');

        if (existing) existing.remove();

        var allVars = getFormulaVariables();

        var pillsHtml = '<div style="margin-bottom:10px;display:flex;flex-wrap:wrap;gap:4px;max-height:200px;overflow-y:auto">';
        allVars.forEach(function(v) {
            pillsHtml += '<span class="he-formula-pill" data-var="' + v + '" style="padding:2px 8px;background:#1c1c3a;border:1px solid #a78bfa;border-radius:12px;color:#a78bfa;font-size:10px;cursor:pointer;white-space:nowrap">' + v + '</span>';
        });
        pillsHtml += '</div>';

        var modal = document.createElement('div');
        modal.id = 'he-formula-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:#161b22;border:1px solid #30363d;border-radius:10px;padding:20px;min-width:550px;max-width:700px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">' +
                    '<span style="font-size:14px;font-weight:600;color:#e6edf3">Formula: ' + (role.name || 'Unnamed Role') + '</span>' +
                    '<button id="he-formula-close" style="background:none;border:none;color:#8b949e;font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div style="margin-bottom:8px;color:#8b949e;font-size:11px">Available variables (click to insert):</div>' +
                pillsHtml +
                '<div style="position:relative">' +
                    '<div id="he-formula-input" contenteditable="true" style="width:100%;min-height:100px;padding:10px;background:#0d1117;border:1px solid #30363d;border-radius:6px;color:#e6edf3;font-family:monospace;font-size:13px;outline:none;white-space:pre-wrap;word-wrap:break-word"></div>' +
                    '<div id="he-formula-autocomplete" style="position:absolute;top:100%;left:0;right:0;background:#161b22;border:1px solid #30363d;border-radius:0 0 6px 6px;max-height:120px;overflow-y:auto;display:none;z-index:10"></div>' +
                '</div>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">' +
                    '<button id="he-formula-cancel" style="padding:6px 14px;background:none;border:1px solid #30363d;border-radius:6px;color:#8b949e;font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-formula-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        var input = document.getElementById('he-formula-input');
        var acBox = document.getElementById('he-formula-autocomplete');

        // Helper: render formula string as HTML with pills
        function formulaToHtml(formula) {
            if (!formula) return '';
            return formula.replace(/([a-zA-Z][\w\-]*)/g, function(word) {
                if (allVars.indexOf(word) !== -1) {
                    return '<span contenteditable="false" style="display:inline-block;padding:1px 6px;margin:0 2px;background:#1c1c3a;border:1px solid #a78bfa;border-radius:10px;color:#a78bfa;font-size:11px;vertical-align:baseline;user-select:all">' + word + '</span>';
                }
                return word;
            });
        }

        // Helper: extract plain text formula from contenteditable
        function getFormulaText() {
            return input.innerText.trim();
        }

        // Initialize with existing formula
        input.innerHTML = formulaToHtml(role.formula || '');

        // Click pill to insert variable
        document.querySelectorAll('.he-formula-pill').forEach(function(pill) {
            pill.addEventListener('mousedown', function(e) {
                e.preventDefault(); // prevent stealing focus from input
            });
            pill.addEventListener('click', function() {
                var v = pill.getAttribute('data-var');
                var pillHtml = '<span contenteditable="false" style="display:inline-block;padding:1px 6px;margin:0 2px;background:#1c1c3a;border:1px solid #a78bfa;border-radius:10px;color:#a78bfa;font-size:11px;vertical-align:baseline;user-select:all">' + v + '</span>&nbsp;';
                input.focus();
                // Place cursor at end if no selection
                var sel = window.getSelection();
                if (!sel.rangeCount || !input.contains(sel.anchorNode)) {
                    var range = document.createRange();
                    range.selectNodeContents(input);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                document.execCommand('insertHTML', false, pillHtml);
            });
        });

        // Autocomplete on typing
        input.addEventListener('input', function() {
            var text = getFormulaText();
            var sel = window.getSelection();
            if (!sel.rangeCount) { acBox.style.display = 'none'; return; }
            // Get text before cursor
            var range = sel.getRangeAt(0);
            var preRange = range.cloneRange();
            preRange.selectNodeContents(input);
            preRange.setEnd(range.startContainer, range.startOffset);
            var before = preRange.toString();
            var wordMatch = before.match(/([a-zA-Z][\w\-]*)$/);
            if (!wordMatch || wordMatch[1].length < 2) { acBox.style.display = 'none'; return; }
            var partial = wordMatch[1].toLowerCase();
            var matches = allVars.filter(function(v) { return v.toLowerCase().indexOf(partial) !== -1; });
            if (matches.length === 0 || (matches.length === 1 && matches[0] === wordMatch[1])) { acBox.style.display = 'none'; return; }
            acBox.innerHTML = matches.slice(0, 8).map(function(m) {
                return '<div class="he-ac-item" data-val="' + m + '" style="padding:6px 10px;cursor:pointer;font-size:11px;color:#e6edf3;font-family:monospace;border-bottom:1px solid #21262d">' + m + '</div>';
            }).join('');
            acBox.style.display = 'block';
            acBox.querySelectorAll('.he-ac-item').forEach(function(item) {
                item.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    var replacement = item.getAttribute('data-val');
                    // Delete the partial word and insert pill
                    var sel2 = window.getSelection();
                    var r2 = sel2.getRangeAt(0);
                    r2.setStart(r2.startContainer, r2.startOffset - wordMatch[1].length);
                    r2.deleteContents();
                    var pillHtml = '<span contenteditable="false" style="display:inline-block;padding:1px 6px;margin:0 2px;background:#1c1c3a;border:1px solid #a78bfa;border-radius:10px;color:#a78bfa;font-size:11px;vertical-align:baseline;user-select:all">' + replacement + '</span>&nbsp;';
                    document.execCommand('insertHTML', false, pillHtml);
                    acBox.style.display = 'none';
                    input.focus();
                });
            });
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && acBox.style.display === 'block') {
                e.preventDefault();
                var first = acBox.querySelector('.he-ac-item');
                if (first) first.dispatchEvent(new MouseEvent('mousedown', {bubbles:true}));
            }
            if (e.key === 'Backspace') {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var range = sel.getRangeAt(0);
                    if (range.collapsed && range.startOffset === 0 && range.startContainer === input) return;
                    // Check if previous sibling is a pill span
                    if (range.collapsed) {
                        var node = range.startContainer;
                        if (node === input && range.startOffset > 0) {
                            var prev = input.childNodes[range.startOffset - 1];
                            if (prev && prev.nodeType === 1 && prev.getAttribute('contenteditable') === 'false') {
                                e.preventDefault();
                                prev.remove();
                                return;
                            }
                        } else if (node.nodeType === 3 && range.startOffset === 0) {
                            var prevSib = node.previousSibling;
                            if (prevSib && prevSib.nodeType === 1 && prevSib.getAttribute('contenteditable') === 'false') {
                                e.preventDefault();
                                prevSib.remove();
                                return;
                            }
                        }
                    }
                }
            }
        });
        input.addEventListener('blur', function() { setTimeout(function() { acBox.style.display = 'none'; }, 200); });

        document.getElementById('he-formula-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-formula-cancel').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        document.getElementById('he-formula-save').addEventListener('click', function() {
            var val = getFormulaText();
            if (!val) { modal.remove(); renderGroups(); return; }
            // Validate: replace known variables with 1, then try to evaluate
            var testExpr = val;
            allVars.forEach(function(v) {
                testExpr = testExpr.replace(new RegExp(v.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '1');
            });
            try {
                var result = Function('"use strict"; return (' + testExpr + ')')();
                if (typeof result !== 'number' || isNaN(result)) throw new Error('Not a number');
                engineSettings.groups[gi].roles[ri].formula = val;
                saveSettings();
                modal.remove();
                renderGroups();
            } catch(e) {
                var errDiv = document.getElementById('he-formula-error');
                if (!errDiv) {
                    errDiv = document.createElement('div');
                    errDiv.id = 'he-formula-error';
                    errDiv.style.cssText = 'margin-top:8px;padding:6px 10px;background:#2d1215;border:1px solid #da3633;border-radius:4px;color:#da3633;font-size:11px';
                    input.parentNode.after(errDiv);
                }
                errDiv.textContent = '⚠ Invalid formula: ' + e.message;
            }
        });
    }

    function initEventHandlers() {
        // Render groups on init
        renderGroups();

        // Add Group button
        var addGrpBtn = document.getElementById('he-add-group');
        if (addGrpBtn) addGrpBtn.addEventListener('click', function() {
            collectGroupsFromDOM();
            if (!engineSettings.groups) engineSettings.groups = [];
            engineSettings.groups.push({ name: '', color: '#6b21a8', roles: [] });
            saveSettings(); renderGroups();
        });

        // Tab switching
        var tabs = document.querySelectorAll('.he-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                tabs.forEach(function(t) {
                    t.style.borderBottomColor = 'transparent';
                    t.style.color = '#8b949e';
                });
                tab.style.borderBottomColor = '#a020b8';
                tab.style.color = '#e6edf3';
                document.querySelectorAll('.he-tab-content').forEach(function(c) {
                    c.style.display = 'none';
                });
                document.getElementById('he-tab-' + tab.getAttribute('data-tab')).style.display = 'flex';
                if (tab.getAttribute('data-tab') === 'plan') renderPlanTab();
            });
        });

        // Settings items hover + click
        var settingItems = document.querySelectorAll('.he-setting-item');
        settingItems.forEach(function(item) {
            item.addEventListener('mouseenter', function() {
                item.style.background = '#161b22';
                item.style.borderLeftColor = '#a020b8';
            });
            item.addEventListener('mouseleave', function() {
                item.style.background = 'none';
                item.style.borderLeftColor = 'transparent';
            });
            item.addEventListener('click', function() {
                openSettingModal(item.getAttribute('data-setting'));
            });
        });
    }


    // Engine settings storage
    var engineSettings = GM_getValue('he-settings', { siteCode: '' });
    var enginePresets = GM_getValue('he-presets', {});
    var activePresetId = GM_getValue('he-active-preset', '');

    function saveSettings() {
        GM_setValue('he-settings', engineSettings);
        // Also update active preset snapshot
        if (activePresetId && enginePresets[activePresetId]) {
            enginePresets[activePresetId].settings = JSON.parse(JSON.stringify(engineSettings));
            savePresets();
        }
    }
    function savePresets() { GM_setValue('he-presets', enginePresets); GM_setValue('he-active-preset', activePresetId); }

    function getSettingContent(settingId) {
        if (settingId === 'site-code') {
            return '<label style="display:block;margin-bottom:8px;color:#e6edf3;font-size:12px">Site Code</label>' +
                '<input id="he-set-site-code" type="text" value="' + (engineSettings.siteCode || '') + '" placeholder="e.g. ORD9" style="width:100%;padding:8px 12px;background:#0d1117;border:1px solid #30363d;border-radius:6px;color:#e6edf3;font-size:13px">';
        }
        if (settingId === 'presets') {
            var html = '<div style="margin-bottom:12px">';
            // List existing presets
            var ids = Object.keys(enginePresets);
            if (ids.length === 0) {
                html += '<div style="color:#555;font-size:11px;margin-bottom:10px">No presets saved yet.</div>';
            } else {
                ids.forEach(function(id) {
                    var p = enginePresets[id];
                    var isActive = (id === activePresetId);
                    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;margin-bottom:4px;background:' + (isActive ? '#1a3a2a' : '#0d1117') + ';border:1px solid ' + (isActive ? '#2ea043' : '#30363d') + ';border-radius:6px">';
                    html += '<span style="font-size:12px;color:#e6edf3">' + p.name + (isActive ? ' <span style="color:#2ea043;font-size:10px">● active</span>' : '') + '</span>';
                    html += '<div style="display:flex;gap:4px">';
                    html += '<button class="he-preset-load" data-id="' + id + '" style="padding:2px 8px;background:#1f6feb;border:none;border-radius:3px;color:#fff;font-size:10px;cursor:pointer">Load</button>';
                    html += '<button class="he-preset-del" data-id="' + id + '" style="padding:2px 8px;background:#da3633;border:none;border-radius:3px;color:#fff;font-size:10px;cursor:pointer">✕</button>';
                    html += '</div></div>';
                });
            }
            html += '</div>';
            // Create new
            html += '<div style="border-top:1px solid #30363d;padding-top:10px;margin-bottom:10px">';
            html += '<label style="display:block;margin-bottom:4px;color:#8b949e;font-size:11px">New preset name:</label>';
            html += '<div style="display:flex;gap:6px"><input id="he-preset-name" type="text" placeholder="e.g. Day Sort" style="flex:1;padding:6px 10px;background:#0d1117;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px">';
            html += '<button id="he-preset-create" style="padding:6px 12px;background:#1a6b2a;border:1px solid #2ea043;border-radius:4px;color:#fff;font-size:11px;cursor:pointer">Create</button></div>';
            html += '</div>';
            // Import / Export
            html += '<div style="border-top:1px solid #30363d;padding-top:10px;display:flex;gap:6px">';
            html += '<button id="he-preset-export" style="padding:5px 10px;background:none;border:1px solid #30363d;border-radius:4px;color:#8b949e;font-size:11px;cursor:pointer">📤 Export Active</button>';
            html += '<button id="he-preset-import" style="padding:5px 10px;background:none;border:1px solid #30363d;border-radius:4px;color:#8b949e;font-size:11px;cursor:pointer">📥 Import</button>';
            html += '</div>';
            return html;
        }
        if (settingId === 'plan-mode') {
            var current = engineSettings.planMode || '';
            var modes = [
                { id: 'golden-eye', name: 'Golden Eye', desc: 'Pull Headcounts from Golden Eye' },
                { id: 'simple', name: 'Simple', desc: 'Enter total volume plan, estimate package breakdown' },
                { id: 'scaling', name: 'Scaling', desc: 'Enter total volume plan, pull inbound data, scale data to fit plan' },
                { id: 'exact', name: 'Exact', desc: 'Pull inbound data, and use precise package breakdown' },
                { id: 'deep-dive', name: 'Deep Dive', desc: 'Pull inbound data from packageflix, including stacking filters' }
            ];
            var html = '<div style="margin-bottom:8px;color:#8b949e;font-size:11px">Select planning mode:</div>';
            modes.forEach(function(m) {
                var sel = (current === m.id);
                html += '<label class="he-mode-label" data-mode="' + m.id + '" style="display:flex;align-items:flex-start;gap:8px;padding:8px 10px;margin-bottom:4px;background:' + (sel ? '#1a3a2a' : '#0d1117') + ';border:1px solid ' + (sel ? '#2ea043' : '#30363d') + ';border-radius:6px;cursor:pointer">';
                html += '<input type="radio" name="he-plan-mode" value="' + m.id + '"' + (sel ? ' checked' : '') + ' style="margin-top:2px">';
                html += '<div style="flex:1"><div style="font-size:12px;font-weight:600;color:#e6edf3">' + m.name + '</div><div style="font-size:11px;color:#8b949e">' + m.desc + '</div></div>';
                if (m.id === 'simple') {
                    html += '<button id="he-pkg-breakdown-btn" style="padding:3px 8px;background:#1f6feb;border:none;border-radius:4px;color:#fff;font-size:10px;cursor:pointer;white-space:nowrap" title="Set package breakdown percentages">📦 Mix</button>';
                }
                html += '</label>';
            });
            return html;
        }
        if (settingId === 'mhe-type-attrs') {
            if (!engineSettings.mheTypes || engineSettings.mheTypes.length === 0) {
                return '<div style="color:#da3633;font-size:12px;padding:10px 0">⚠ No MHE types defined. Please add MHE types in "MHE Type List" first.</div>';
            }
            if (!engineSettings.mheAttrs) engineSettings.mheAttrs = {};
            var attrs = [
                'Hourly Throughput', 'Container Build %', 'Fluid Load %', 'Direct to Container %',
                'Shuttle Volume %', 'Pallet Volume %', 'Cart Volume %', 'Bag Volume %',
                'Chute - Lanes Volume %', 'Chute - OB Volume %', 'Runout Volume %',
                'Packages per Shuttle', 'Packages per Pallet', 'Packages per Cart', 'Packages per Bag'
            ];
            var types = engineSettings.mheTypes;
            var html = '<div style="overflow-x:auto;font-size:11px">';
            html += '<table style="width:100%;border-collapse:collapse">';
            // Header row
            html += '<tr><td style="padding:4px 6px;font-weight:600;color:#8b949e;border-bottom:1px solid #30363d">Attribute</td>';
            types.forEach(function(t) {
                html += '<td style="padding:4px 6px;font-weight:600;color:#e6edf3;text-align:center;border-bottom:1px solid #30363d;min-width:70px">' + t + '</td>';
            });
            html += '</tr>';
            // Data rows
            attrs.forEach(function(attr) {
                html += '<tr>';
                html += '<td style="padding:3px 6px;color:#e6edf3;border-bottom:1px solid #21262d;white-space:nowrap">' + attr + '</td>';
                types.forEach(function(t) {
                    var key = t + '|' + attr;
                    var val = engineSettings.mheAttrs[key] || '0';
                    html += '<td style="padding:2px 4px;border-bottom:1px solid #21262d;text-align:center">';
                    html += '<input class="he-mhe-attr" data-key="' + key + '" type="text" value="' + val + '" style="width:55px;padding:3px 4px;background:#0d1117;border:1px solid #30363d;border-radius:3px;color:#e6edf3;font-size:11px;text-align:center;-moz-appearance:textfield;appearance:textfield">';
                    html += '</td>';
                });
                html += '</tr>';
            });
            html += '</table></div>';
            return html;
        }
        if (settingId === 'mhe-type-list') {
            if (!engineSettings.mheTypes) engineSettings.mheTypes = [];
            var html = '<div style="margin-bottom:10px">';
            engineSettings.mheTypes.forEach(function(name, i) {
                html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">';
                html += '<input class="he-mhe-name" data-idx="' + i + '" type="text" value="' + (name || '') + '" placeholder="e.g. Auto Sorter" style="flex:1;padding:6px 10px;background:#0d1117;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px">';
                html += '<button class="he-mhe-del" data-idx="' + i + '" style="padding:4px 8px;background:#da3633;border:none;border-radius:3px;color:#fff;font-size:10px;cursor:pointer">✕</button>';
                html += '</div>';
            });
            if (engineSettings.mheTypes.length === 0) {
                html += '<div style="color:#555;font-size:11px">No MHE types defined yet.</div>';
            }
            html += '</div>';
            html += '<button id="he-mhe-add" style="padding:5px 12px;background:#1f6feb;border:none;border-radius:4px;color:#fff;font-size:11px;cursor:pointer">+ Add MHE</button>';
            return html;
        }
        if (settingId === 'sort-times') {
            if (!engineSettings.sortTimes) engineSettings.sortTimes = [];
            var html = '<div style="margin-bottom:10px">';
            engineSettings.sortTimes.forEach(function(s, i) {
                html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">';
                html += '<input class="he-sort-name" data-idx="' + i + '" type="text" value="' + (s.name || '') + '" placeholder="Name" style="width:90px;padding:6px 8px;background:#0d1117;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px">';
                html += '<input class="he-sort-start" data-idx="' + i + '" type="text" value="' + (s.start || '') + '" placeholder="Start" style="width:70px;padding:6px 8px;background:#0d1117;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px">';
                html += '<input class="he-sort-end" data-idx="' + i + '" type="text" value="' + (s.end || '') + '" placeholder="End" style="width:70px;padding:6px 8px;background:#0d1117;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px">';
                html += '<button class="he-sort-del" data-idx="' + i + '" style="padding:4px 8px;background:#da3633;border:none;border-radius:3px;color:#fff;font-size:10px;cursor:pointer">✕</button>';
                html += '</div>';
            });
            if (engineSettings.sortTimes.length === 0) {
                html += '<div style="color:#555;font-size:11px">No sorts defined yet.</div>';
            }
            html += '</div>';
            html += '<button id="he-sort-add" style="padding:5px 12px;background:#1f6feb;border:none;border-radius:4px;color:#fff;font-size:11px;cursor:pointer">+ Add Sort</button>';
            return html;
        }
        if (settingId === 'engineer-rates') {
            if (!engineSettings.engineerRates || !engineSettings._erSeeded) {
                engineSettings.engineerRates = [
                {desc:'Problem Solve Gate Keeper',rate:'50'},{desc:'Problem Solve Processing',rate:'30'},
                {desc:'Robin Induct',rate:'500'},{desc:'AR Induct',rate:'400'},{desc:'AFM',rate:'500'},
                {desc:'Jam Clear',rate:'5000'},{desc:'TDR',rate:'10000'},
                {desc:'Fluid Unload (Sortable)',rate:'1500'},{desc:'Fluid Unload (TNS)',rate:'750'},
                {desc:'Shuttle Dumper',rate:'1300'},{desc:'Container Unload',rate:'9000'},{desc:'Missort',rate:'N/A'},
                {desc:'Build to pallet',rate:'350'},{desc:'Scan to container (small)',rate:'190'},
                {desc:'Scan to container (medium)',rate:'117'},{desc:'Scan to container (large)',rate:'93'},
                {desc:'Sort Waterspider',rate:'900'},{desc:'Cart wrangler',rate:'1500'},
                {desc:'Sort NC Processing',rate:'85'},{desc:'NC Waterspider',rate:'50'},
                {desc:'NC Staging',rate:'60'},{desc:'NC Runner',rate:'60'},{desc:'NC Feeder',rate:'250'},
                {desc:'OB Stager DDU',rate:'1200'},{desc:'OB Stager AMZL/RSR',rate:'1000'},
                {desc:'Dock Associate',rate:'1200'},{desc:'XD Loaders',rate:'3000'},
                {desc:'XD Unloaders',rate:'9000'},{desc:'AMZL Sortable Loaders',rate:'3000'},{desc:'Merge',rate:'150'}
            ];
                engineSettings._erSeeded = true;
                saveSettings();
            }
            var html = '<div style="margin-bottom:10px;max-height:350px;overflow-y:auto;padding-right:12px">';
            engineSettings.engineerRates.forEach(function(item, i) {
                html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">';
                html += '<input class="he-erate-desc" data-idx="' + i + '" type="text" value="' + (item.desc || '') + '" placeholder="Description" style="flex:1;padding:5px 8px;background:#0d1117;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:11px">';
                html += '<input class="he-erate-val" data-idx="' + i + '" type="text" value="' + (item.rate || '') + '" placeholder="#" style="width:60px;padding:5px 8px;background:#0d1117;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:11px;text-align:center">';
                html += '<button class="he-erate-del" data-idx="' + i + '" style="padding:3px 6px;background:#da3633;border:none;border-radius:3px;color:#fff;font-size:9px;cursor:pointer">✕</button>';
                html += '</div>';
            });
            if (engineSettings.engineerRates.length === 0) {
                html += '<div style="color:#555;font-size:11px">No engineer rates defined yet.</div>';
            }
            html += '</div>';
            html += '<button id="he-erate-add" style="padding:5px 12px;background:#1f6feb;border:none;border-radius:4px;color:#fff;font-size:11px;cursor:pointer">+ Add Rate</button>';
            return html;
        }
        if (settingId === 'volume-mix') {
            if (!engineSettings.mheTypes || engineSettings.mheTypes.length === 0) {
                return '<div style="color:#da3633;font-size:12px;padding:10px 0">⚠ No MHE types defined. Please add MHE types in "MHE Type List" first.</div>';
            }
            if (!engineSettings.volumeMix) engineSettings.volumeMix = {};
            var sizes = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large', 'Non-Con', 'Non-Con Plus'];
            var types = engineSettings.mheTypes;
            var html = '<div style="overflow-x:auto;font-size:11px">';
            html += '<table style="width:100%;border-collapse:collapse">';
            // Header
            html += '<tr><td style="padding:4px 6px;font-weight:600;color:#8b949e;border-bottom:1px solid #30363d">Volume Mix %</td>';
            types.forEach(function(t) {
                html += '<td style="padding:4px 6px;font-weight:600;color:#e6edf3;text-align:center;border-bottom:1px solid #30363d;min-width:60px">' + t + '</td>';
            });
            html += '<td style="padding:4px 6px;font-weight:600;color:#8b949e;text-align:center;border-bottom:1px solid #30363d">Total</td></tr>';
            // Rows
            sizes.forEach(function(size) {
                html += '<tr data-row="' + size + '">';
                html += '<td style="padding:3px 6px;color:#e6edf3;border-bottom:1px solid #21262d;white-space:nowrap">' + size + '</td>';
                types.forEach(function(t) {
                    var key = t + '|' + size;
                    var val = engineSettings.volumeMix[key] || '0';
                    html += '<td style="padding:2px 4px;border-bottom:1px solid #21262d;text-align:center">';
                    html += '<input class="he-vmix" data-key="' + key + '" data-row="' + size + '" type="text" value="' + val + '" style="width:50px;padding:3px 4px;background:#0d1117;border:1px solid #30363d;border-radius:3px;color:#e6edf3;font-size:11px;text-align:center">';
                    html += '</td>';
                });
                html += '<td class="he-vmix-total" data-row="' + size + '" style="padding:3px 6px;border-bottom:1px solid #21262d;text-align:center;font-weight:600;font-size:11px">0%</td>';
                html += '</tr>';
            });
            html += '</table></div>';
            return html;
        }
        return 'Setting editor for <strong style="color:#e6edf3">' + settingId + '</strong> coming soon.';
    }

    function handleSettingSave(settingId) {
        if (settingId === 'site-code') {
            var val = document.getElementById('he-set-site-code');
            if (val) {
                engineSettings.siteCode = val.value.trim().toUpperCase();
                saveSettings();
                var disp = document.getElementById('he-site-display');
                if (disp) disp.textContent = engineSettings.siteCode || '—';
            }
        }
        if (settingId === 'plan-mode') {
            var selected = document.querySelector('input[name="he-plan-mode"]:checked');
            if (selected) { engineSettings.planMode = selected.value; saveSettings(); }
        }
        if (settingId === 'mhe-type-list') {
            var inputs = document.querySelectorAll('.he-mhe-name');
            engineSettings.mheTypes = [];
            inputs.forEach(function(el) { if (el.value.trim()) engineSettings.mheTypes.push(el.value.trim()); });
            saveSettings();
        }
        if (settingId === 'mhe-type-attrs') {
            if (!engineSettings.mheAttrs) engineSettings.mheAttrs = {};
            document.querySelectorAll('.he-mhe-attr').forEach(function(el) {
                engineSettings.mheAttrs[el.getAttribute('data-key')] = el.value.trim();
            });
            saveSettings();
        }
        if (settingId === 'volume-mix') {
            if (!engineSettings.volumeMix) engineSettings.volumeMix = {};
            document.querySelectorAll('.he-vmix').forEach(function(el) {
                engineSettings.volumeMix[el.getAttribute('data-key')] = el.value.trim();
            });
            saveSettings();
        }
        if (settingId === 'engineer-rates') {
            var descs = document.querySelectorAll('.he-erate-desc');
            var vals = document.querySelectorAll('.he-erate-val');
            engineSettings.engineerRates = [];
            descs.forEach(function(el, i) {
                engineSettings.engineerRates.push({ desc: el.value.trim(), rate: vals[i] ? vals[i].value.trim() : '' });
            });
            saveSettings();
        }
        if (settingId === 'sort-times') {
            var names = document.querySelectorAll('.he-sort-name');
            var starts = document.querySelectorAll('.he-sort-start');
            var ends = document.querySelectorAll('.he-sort-end');
            engineSettings.sortTimes = [];
            starts.forEach(function(el, i) {
                var nameEl = names[i];
                var endEl = ends[i];
                engineSettings.sortTimes.push({ name: nameEl ? nameEl.value.trim() : '', start: el.value.trim(), end: endEl ? endEl.value.trim() : '' });
            });
            saveSettings();
        }
        // Presets don't use the Save button — they have their own buttons
    }

    function attachPresetHandlers() {
        // Create
        var createBtn = document.getElementById('he-preset-create');
        if (createBtn) createBtn.addEventListener('click', function() {
            var nameEl = document.getElementById('he-preset-name');
            var name = nameEl ? nameEl.value.trim() : '';
            if (!name) return;
            var id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
            enginePresets[id] = { name: name, settings: JSON.parse(JSON.stringify(engineSettings)) };
            activePresetId = id;
            savePresets();
            openSettingModal('presets'); // refresh
        });
        // Load
        document.querySelectorAll('.he-preset-load').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                if (enginePresets[id]) {
                    engineSettings = JSON.parse(JSON.stringify(enginePresets[id].settings));
                    activePresetId = id;
                    saveSettings(); savePresets();
                    var disp = document.getElementById('he-site-display');
                    if (disp) disp.textContent = engineSettings.siteCode || '—';
                    renderGroups();
                    openSettingModal('presets');
                }
            });
        });
        // Delete
        document.querySelectorAll('.he-preset-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = btn.getAttribute('data-id');
                delete enginePresets[id];
                if (activePresetId === id) activePresetId = '';
                savePresets();
                openSettingModal('presets');
            });
        });
        // Export active preset
        var exportBtn = document.getElementById('he-preset-export');
        if (exportBtn) exportBtn.addEventListener('click', function() {
            if (!activePresetId || !enginePresets[activePresetId]) { alert('No active preset to export.'); return; }
            var obj = {}; obj[activePresetId] = enginePresets[activePresetId];
            var json = JSON.stringify(obj, null, 2);
            navigator.clipboard.writeText(json).then(function() { alert('Preset "' + enginePresets[activePresetId].name + '" copied to clipboard!'); });
        });
        // Import
        var importBtn = document.getElementById('he-preset-import');
        if (importBtn) importBtn.addEventListener('click', function() {
            var json = prompt('Paste exported presets JSON:');
            if (!json) return;
            try {
                var imported = JSON.parse(json);
                Object.keys(imported).forEach(function(k) { enginePresets[k] = imported[k]; });
                savePresets();
                openSettingModal('presets');
            } catch(e) { alert('Invalid JSON'); }
        });
    }


    function openPackageBreakdownModal() {
        var existing = document.getElementById('he-pkg-modal');
        if (existing) existing.remove();
        if (!engineSettings.packageBreakdown) {
            engineSettings.packageBreakdown = { extraSmall: '29.37', small: '19.73', medium: '17.91', large: '18.09', extraLarge: '8.63', nonCon: '3.45', nonConPlus: '2.83' };
        }
        var bd = engineSettings.packageBreakdown;
        var fields = [
            { key: 'extraSmall', label: 'Extra Small' },
            { key: 'small', label: 'Small' },
            { key: 'medium', label: 'Medium' },
            { key: 'large', label: 'Large' },
            { key: 'extraLarge', label: 'Extra Large' },
            { key: 'nonCon', label: 'Non Con' },
            { key: 'nonConPlus', label: 'Non Con+' }
        ];
        var html = '<div style="margin-bottom:12px;color:#8b949e;font-size:11px">Enter percentage breakdown (should sum to 100%):</div>';
        fields.forEach(function(f) {
            html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">';
            html += '<span style="font-size:12px;color:#e6edf3">' + f.label + '</span>';
            html += '<div style="display:flex;align-items:center;gap:4px"><input id="he-pkg-' + f.key + '" type="number" value="' + (bd[f.key] || '') + '" placeholder="%" style="width:60px;padding:5px 8px;background:#0d1117;border:1px solid #30363d;border-radius:4px;color:#e6edf3;font-size:12px;text-align:right;-moz-appearance:textfield;appearance:textfield"><span style="color:#8b949e;font-size:11px">%</span></div>';
            html += '</div>';
        });
        html += '<div id="he-pkg-total" style="margin-top:10px;padding:8px 10px;border-radius:4px;font-size:12px;font-weight:600;text-align:right"></div>';

        var modal = document.createElement('div');
        modal.id = 'he-pkg-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100001;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:#161b22;border:1px solid #30363d;border-radius:10px;padding:20px;min-width:280px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">' +
                    '<span style="font-size:14px;font-weight:600;color:#e6edf3">Package Breakdown</span>' +
                    '<button id="he-pkg-close" style="background:none;border:none;color:#8b949e;font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div id="he-pkg-fields">' + html + '</div>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">' +
                    '<button id="he-pkg-cancel" style="padding:6px 14px;background:none;border:1px solid #30363d;border-radius:6px;color:#8b949e;font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-pkg-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('he-pkg-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-pkg-cancel').addEventListener('click', function() { modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

        // Hide number spinners
        var style = document.createElement('style');
        style.textContent = '#he-pkg-modal input[type=number]::-webkit-inner-spin-button,#he-pkg-modal input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}';
        modal.appendChild(style);

        // Running total
        function updateTotal() {
            var sum = 0;
            fields.forEach(function(f) {
                var el = document.getElementById('he-pkg-' + f.key);
                if (el && el.value) sum += parseFloat(el.value) || 0;
            });
            var totalEl = document.getElementById('he-pkg-total');
            var saveBtn = document.getElementById('he-pkg-save');
            if (totalEl) {
                var isGood = (Math.abs(sum - 100) < 0.1);
                totalEl.style.color = isGood ? '#2ea043' : '#da3633';
                totalEl.style.background = isGood ? '#1a3a2a' : '#2d1215';
                totalEl.textContent = 'Total: ' + sum.toFixed(1) + '%' + (isGood ? ' ✓' : '');
                if (saveBtn) {
                    saveBtn.disabled = !isGood;
                    saveBtn.style.opacity = isGood ? '1' : '0.4';
                    saveBtn.style.cursor = isGood ? 'pointer' : 'not-allowed';
                }
            }
        }
        fields.forEach(function(f) {
            var el = document.getElementById('he-pkg-' + f.key);
            if (el) el.addEventListener('input', updateTotal);
        });
        updateTotal();

        document.getElementById('he-pkg-save').addEventListener('click', function() {
            fields.forEach(function(f) {
                var el = document.getElementById('he-pkg-' + f.key);
                if (el) engineSettings.packageBreakdown[f.key] = el.value.trim();
            });
            saveSettings();
            modal.remove();
        });
    }

    function openSettingModal(settingId) {
        // Remove existing modal if any
        var existing = document.getElementById('he-setting-modal');
        if (existing) existing.remove();

        var titles = {
            'site-code': 'Site Code',
            'presets': 'Presets',
            'sort-times': 'Sort Times',
            'plan-mode': 'Plan Mode',
            'mhe-type-list': 'MHE Type List',
            'mhe-type-attrs': 'MHE Type Attributes',
            'volume-mix': 'Volume Mix',
            'engineer-rates': 'Engineer Rates'
        };

        var modal = document.createElement('div');
        modal.id = 'he-setting-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100000;display:flex;align-items:center;justify-content:center';
        modal.innerHTML =
            '<div style="background:#161b22;border:1px solid #30363d;border-radius:10px;padding:20px;min-width:320px;max-width:500px;box-shadow:0 8px 30px rgba(0,0,0,0.8)">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">' +
                    '<span style="font-size:14px;font-weight:600;color:#e6edf3">' + (titles[settingId] || settingId) + '</span>' +
                    '<button id="he-modal-close" style="background:none;border:none;color:#8b949e;font-size:18px;cursor:pointer">✕</button>' +
                '</div>' +
                '<div id="he-modal-body" style="color:#8b949e;font-size:12px;padding:10px 0">' +
                    getSettingContent(settingId) +
                '</div>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">' +
                    '<button id="he-modal-cancel" style="padding:6px 14px;background:none;border:1px solid #30363d;border-radius:6px;color:#8b949e;font-size:12px;cursor:pointer">Cancel</button>' +
                    '<button id="he-modal-save" style="padding:6px 14px;background:#1f6feb;border:none;border-radius:6px;color:#fff;font-size:12px;cursor:pointer">Save</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('he-modal-close').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-modal-cancel').addEventListener('click', function() { modal.remove(); });
        document.getElementById('he-modal-save').addEventListener('click', function() { handleSettingSave(settingId); modal.remove(); });
        modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
        if (settingId === 'presets') attachPresetHandlers();
        if (settingId === 'plan-mode') {
            var pkgBtn = document.getElementById('he-pkg-breakdown-btn');
            if (pkgBtn) pkgBtn.addEventListener('click', function(e) {
                e.preventDefault(); e.stopPropagation();
                openPackageBreakdownModal();
            });
            // Update label highlights on radio change and save immediately
            document.querySelectorAll('input[name="he-plan-mode"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    document.querySelectorAll('.he-mode-label').forEach(function(lbl) {
                        var isSel = (lbl.getAttribute('data-mode') === radio.value && radio.checked);
                        lbl.style.background = isSel ? '#1a3a2a' : '#0d1117';
                        lbl.style.borderColor = isSel ? '#2ea043' : '#30363d';
                    });
                    engineSettings.planMode = radio.value;
                    saveSettings();
                    renderGroups();
                });
            });
        }
        if (settingId === 'sort-times') {
            var addBtn = document.getElementById('he-sort-add');
            if (addBtn) addBtn.addEventListener('click', function() {
                if (!engineSettings.sortTimes) engineSettings.sortTimes = [];
                // Save current input values first
                var names = document.querySelectorAll('.he-sort-name');
                var starts = document.querySelectorAll('.he-sort-start');
                var ends = document.querySelectorAll('.he-sort-end');
                engineSettings.sortTimes = [];
                starts.forEach(function(el, i) {
                    engineSettings.sortTimes.push({ name: names[i] ? names[i].value.trim() : '', start: el.value.trim(), end: ends[i] ? ends[i].value.trim() : '' });
                });
                engineSettings.sortTimes.push({ name: '', start: '', end: '' });
                saveSettings();
                openSettingModal('sort-times');
            });
            document.querySelectorAll('.he-sort-del').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    // Save current values first
                    var names = document.querySelectorAll('.he-sort-name');
                    var starts = document.querySelectorAll('.he-sort-start');
                    var ends = document.querySelectorAll('.he-sort-end');
                    engineSettings.sortTimes = [];
                    starts.forEach(function(el, i) {
                        engineSettings.sortTimes.push({ name: names[i] ? names[i].value.trim() : '', start: el.value.trim(), end: ends[i] ? ends[i].value.trim() : '' });
                    });
                    var idx = parseInt(btn.getAttribute('data-idx'));
                    engineSettings.sortTimes.splice(idx, 1);
                    saveSettings();
                    openSettingModal('sort-times');
                });
            });
        }
        if (settingId === 'mhe-type-list') {
            var addBtn = document.getElementById('he-mhe-add');
            if (addBtn) addBtn.addEventListener('click', function() {
                var inputs = document.querySelectorAll('.he-mhe-name');
                engineSettings.mheTypes = [];
                inputs.forEach(function(el) { engineSettings.mheTypes.push(el.value.trim()); });
                engineSettings.mheTypes.push('');
                saveSettings();
                openSettingModal('mhe-type-list');
            });
            document.querySelectorAll('.he-mhe-del').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var inputs = document.querySelectorAll('.he-mhe-name');
                    engineSettings.mheTypes = [];
                    inputs.forEach(function(el) { engineSettings.mheTypes.push(el.value.trim()); });
                    var idx = parseInt(btn.getAttribute('data-idx'));
                    engineSettings.mheTypes.splice(idx, 1);
                    saveSettings();
                    openSettingModal('mhe-type-list');
                });
            });
        }
        if (settingId === 'engineer-rates') {
            var addBtn = document.getElementById('he-erate-add');
            if (addBtn) addBtn.addEventListener('click', function() {
                var descs = document.querySelectorAll('.he-erate-desc');
                var vals = document.querySelectorAll('.he-erate-val');
                engineSettings.engineerRates = [];
                descs.forEach(function(el, i) {
                    engineSettings.engineerRates.push({ desc: el.value.trim(), rate: vals[i] ? vals[i].value.trim() : '' });
                });
                engineSettings.engineerRates.push({ desc: '', rate: '' });
                saveSettings();
                openSettingModal('engineer-rates');
            });
            document.querySelectorAll('.he-erate-del').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var descs = document.querySelectorAll('.he-erate-desc');
                    var vals = document.querySelectorAll('.he-erate-val');
                    engineSettings.engineerRates = [];
                    descs.forEach(function(el, i) {
                        engineSettings.engineerRates.push({ desc: el.value.trim(), rate: vals[i] ? vals[i].value.trim() : '' });
                    });
                    var idx = parseInt(btn.getAttribute('data-idx'));
                    engineSettings.engineerRates.splice(idx, 1);
                    saveSettings();
                    openSettingModal('engineer-rates');
                });
            });
        }
        if (settingId === 'volume-mix') {
            function updateRowTotals() {
                var sizes = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large', 'Non-Con', 'Non-Con Plus'];
                sizes.forEach(function(size) {
                    var inputs = document.querySelectorAll('.he-vmix[data-row="' + size + '"]');
                    var sum = 0;
                    inputs.forEach(function(el) { sum += parseFloat(el.value) || 0; });
                    var totalEl = document.querySelector('.he-vmix-total[data-row="' + size + '"]');
                    if (totalEl) {
                        var isGood = (Math.abs(sum - 100) < 0.1);
                        totalEl.style.color = isGood ? '#2ea043' : '#da3633';
                        totalEl.textContent = sum.toFixed(1) + '%';
                    }
                });
            }
            document.querySelectorAll('.he-vmix').forEach(function(el) {
                el.addEventListener('input', updateRowTotals);
            });
            updateRowTotals();
        }
    }

    function init() {
        console.log('[Hydra Engine] v' + ENGINE_VERSION + ' initializing...');
        createPanel();
        console.log('[Hydra Engine] Ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
