import { createServer } from 'node:http';

const PORT = Number(process.env.SHIPYARD_BRIDGE_PORT || 8787);
const REPO = process.env.SHIPYARD_REPO || 'orangetrd-byte/Shipyard';
const TOKEN = process.env.SHIPYARD_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
const ALLOWED_ORIGINS = new Set([
  'https://orangetrd-byte.github.io',
  'http://127.0.0.1:8787',
  'http://localhost:8787',
]);

function send(res, status, data, origin = '') {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Private-Network': 'true',
  };
  if (ALLOWED_ORIGINS.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  res.writeHead(status, headers);
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 100000) req.destroy();
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function createIssue(payload) {
  if (!TOKEN) throw new Error('SHIPYARD_GITHUB_TOKEN is not set');
  const [owner, repo] = REPO.split('/');
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'shipyard-local-bridge',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ title: payload.title, body: payload.body }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `GitHub answered ${response.status}`);
  return {
    number: data.number,
    title: data.title,
    url: data.html_url,
    created_at: data.created_at,
  };
}

createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  if (req.method === 'OPTIONS') return send(res, 204, {}, origin);
  if (req.method === 'GET' && req.url === '/health') return send(res, 200, { ok: true, repo: REPO }, origin);
  if (req.method !== 'POST' || req.url !== '/issues') return send(res, 404, { error: 'Not found' }, origin);
  try {
    const payload = JSON.parse(await readBody(req));
    if (!payload.title && !payload.body) return send(res, 400, { error: 'Missing title or body' }, origin);
    const issue = await createIssue(payload);
    send(res, 201, issue, origin);
  } catch (error) {
    send(res, 500, { error: error.message }, origin);
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Shipyard bridge listening on http://127.0.0.1:${PORT}`);
});
