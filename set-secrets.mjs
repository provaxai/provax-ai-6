import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sodium = require('tweetsodium');

const GITHUB_TOKEN = process.argv[2];
const REPO = 'provaxai/provax-ai-6';

const secrets = {
  CLOUDFLARE_API_TOKEN: process.argv[3],
  CLOUDFLARE_ACCOUNT_ID: process.argv[4],
};

async function getPublicKey() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/actions/secrets/public-key`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
  });
  return res.json();
}

async function setSecret(name, value, keyId, key) {
  const messageBytes = Buffer.from(value);
  const keyBytes = Buffer.from(key, 'base64');
  const encryptedBytes = sodium.seal(messageBytes, keyBytes);
  const encrypted = Buffer.from(encryptedBytes).toString('base64');

  const res = await fetch(`https://api.github.com/repos/${REPO}/actions/secrets/${name}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ encrypted_value: encrypted, key_id: keyId }),
  });
  return res.status;
}

const { key_id, key } = await getPublicKey();
for (const [name, value] of Object.entries(secrets)) {
  const status = await setSecret(name, value, key_id, key);
  console.log(`${name}: ${status === 204 ? 'OK' : `Erro ${status}`}`);
}
