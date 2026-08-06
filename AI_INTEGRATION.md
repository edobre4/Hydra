# Hydra AI Integration - Implementation Guide

Re-apply the following changes to `Hydra.user.js`. Do NOT touch chute map, chute matrix, or any existing functionality. Only ADD the AI section.

## 1. Add `@connect` to userscript header (after the last existing @connect line)

```
// @connect      ds-l013ue9b--7077.us-east-1.prod.proxy.devspaces.amazon.dev
```

## 2. Add AI button in the header (after the CSV button around line 4776)

Find: `'<button id="hydra-csv-btn"...>&#11015; CSV</button>' +`
Add after it:
```javascript
'<button id="hydra-ai-btn" title="Ask Hydra AI" style="border:none;border-radius:4px;padding:5px 10px;font-size:12px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#6b21a8,#2563eb);color:#fff">&#129504; AI</button>' +
```

## 3. Add SECTION 22B before SECTION 23 (INITIALIZATION)

Insert the entire AI section before `// SECTION 23: INITIALIZATION`. This section contains:

- `AI_SERVER_URL` constant pointing to the DevSpace proxy
- `aiVisible` state persisted via `GM_getValue/GM_setValue('hydra_ai_enabled')`
- `hydraAI(on)` function exposed on `unsafeWindow` — toggles AI view, shows/hides header button
- `aiShowView(show)` — switches between AI view and Hydra panel WITHOUT disabling AI
- `aiGatherContext()` — collects full ibTableData, obTableData, dockDoors, buffer data as JSON
- `aiMarkdownToHtml(text)` — rich HTML renderer with table support, headers, lists, code, emoji
- `aiInline(text)` — inline markdown (bold, italic, code, emoji colors)
- `aiSend(question, isAuto)` — POST to AI server via GM_xmlhttpRequest, renders response
- `aiAutoPrompt()` — fires "Show CPT risk assessment" if aiVisible && 5min cooldown passed
- `aiInit()` — creates full-screen AI view div, wires button click + back button + input/send

### Key behaviors:
- `hydraAI(true)` from console: enables AI, shows button, opens AI view, triggers auto-prompt
- `hydraAI(false)`: disables AI, hides button, returns to Hydra
- Header 🧠 AI button: when clicked, calls `aiShowView(true)` (switches to AI view)
- "← Back to Hydra" button: calls `aiShowView(false)` (returns to Hydra, button stays visible)
- State persists via `GM_setValue('hydra_ai_enabled', bool)` so it survives page reloads
- Auto-prompt runs on every refresh completion (hooked into doRefresh .finally and HV refresh) with 5-minute cooldown

## 4. Hook `aiAutoPrompt()` into refresh completion

In `doRefresh`'s `.finally()` block, add:
```javascript
if (typeof aiAutoPrompt === 'function') aiAutoPrompt();
```

In the Hydra Vision refresh success (after `setStatus('✔ Hydra Vision refresh...')`), add the same line.

## 5. Call `aiInit()` at the end of initialization

In the init function, right before `console.log('[Hydra] Ready');`, add:
```javascript
aiInit();
```

## AI Server

Already exists at `~/.workspace/hydra/ai-server/server.js`. Runs on port 7077.
Auto-starts via `.bashrc` line. Reads prompt from `~/shared/user/.kiro/agents/hydra-ops-prompt.txt`.

## Testing

1. Reload script
2. Type `hydraAI(true)` in console — should show full-screen AI view
3. Wait for refresh — should auto-prompt CPT risk
4. Click "← Back to Hydra" — should return to normal view with 🧠 button still visible
5. Click 🧠 button — should return to AI view
