# Hydra AI Server Setup

## What this is
A server that connects Hydra (userscript) to an AI model for staffing optimization.
Hydra sends floor data → server passes it to AI → AI returns a staffing plan.

## Requirements
- An AgentSpace (agentspaces.amazon.dev)
- Node.js (pre-installed in AgentSpaces)
- kiro-cli (pre-installed at /agentspaces/kiro-cli.latest/kiro-cli)

## Setup (5 minutes)

### 1. Create the server directory
```bash
mkdir -p ~/.workspace/hydra-ai-server
cd ~/.workspace/hydra-ai-server
```

### 2. Copy these two files into that directory:
- `server.js` — the server code
- `hydra-ops-prompt.txt` — the AI system prompt

### 3. Move the prompt file to the correct location:
```bash
mkdir -p ~/shared/user/.kiro/agents/
mv hydra-ops-prompt.txt ~/shared/user/.kiro/agents/hydra-ops-prompt.txt
```

### 4. Start the server:
```bash
node server.js
```
You should see: `[Hydra AI Server] Running on port 7077 — concurrent mode`

### 5. Get your server URL:
```bash
cat /etc/devspace/id
```
Your URL is: `https://<YOUR-DEVSPACE-ID>--7077.us-east-1.prod.proxy.devspaces.amazon.dev`

### 6. Update Hydra to point to YOUR server:
In Tampermonkey, edit Hydra.user.js and search for `AI_SERVER_URL`. Change it to your URL from step 5.

## Keep it running
The server stops when your AgentSpace sleeps. To restart:
```bash
cd ~/.workspace/hydra-ai-server && node server.js
```

Or run in background:
```bash
cd ~/.workspace/hydra-ai-server && nohup node server.js > server.log 2>&1 &
```

## Notes
- The server only works for YOU (DevSpace proxy is locked to your identity)
- Each person needs their own AgentSpace + server
- Port 7077 is hardcoded — don't change it unless you also change the userscript
