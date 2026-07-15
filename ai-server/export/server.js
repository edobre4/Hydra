const http = require('http');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 7077;
const KIRO = '/agentspaces/kiro-cli.latest/kiro-cli';
const SYSTEM_PROMPT = fs.readFileSync(path.join(process.env.HOME, 'shared/user/.kiro/agents/hydra-ops-prompt.txt'), 'utf8');

let activeRequests = 0;
let totalRequests = 0;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method !== 'POST') { res.writeHead(405); return res.end('POST only'); }

  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    try {
      const { context, question } = JSON.parse(body);
      const reqId = ++totalRequests;
      activeRequests++;
      console.log(`[Req ${reqId}] Started (active: ${activeRequests})`);

      const needsFullContext = /cpt risk|urgent action|top.*(5|five).*action|optimize|staffing|assign.*flow hc|trailers.*on dock/i.test(question);
      let prompt;
      if (needsFullContext) {
        prompt = `Task: You are helping an Amazon Sort Center operations manager optimize their shift. Use the operational rules and live data below to answer their question.\n\nOperational Rules & Rates:\n${SYSTEM_PROMPT}\n\n---\nLive Dock Data:\n${context}\n\n---\nManager's Question:\n${question}`;
      } else {
        prompt = `Task: You are helping an Amazon Sort Center operations manager. Answer their question using the operational data below. Be direct and concise.\n\nOperational Rules & Context:\n${context}\n\n---\nManager's Question:\n${question}`;
      }

      // Unique temp file per request to prevent conflicts
      const tmpFile = `/tmp/hydra-ai-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.txt`;
      fs.writeFileSync(tmpFile, prompt);

      execFile(KIRO, ['chat', '--no-interactive', '--trust-all-tools', '--model', 'claude-sonnet-5', `@${tmpFile}`], {
        timeout: 120000,
        maxBuffer: 4 * 1024 * 1024,
        env: { ...process.env, TERM: 'dumb' }
      }, (err, stdout, stderr) => {
        activeRequests--;
        try { fs.unlinkSync(tmpFile); } catch(e) {}
        const clean = (stdout || '').replace(/\x1B\[[0-9;?]*[a-zA-Z]/g, '').replace(/^\s*> /gm, '').trim();
        const lines = clean.split('\n').filter(l => !l.match(/Credits:|▸|trusted|Agents can|Learn more/));
        const response = lines.join('\n').trim();

        console.log(`[Req ${reqId}] Done in ${((Date.now() - parseInt(tmpFile.split('-')[2]))/1000).toFixed(1)}s (active: ${activeRequests})`);

        if (!response && err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: (stderr || err.message).slice(0, 500) }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response }));
      });
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
});

server.listen(PORT, () => console.log(`[Hydra AI Server] Running on port ${PORT} — concurrent mode`));
