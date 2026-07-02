// telegram/bot.js
// Telegram bot wrapper — polling + command/callback routing
// Requires env var: TELEGRAM_BOT_TOKEN

const { handleInlet } = require('./commands/inlet.js');
const { handleFloor } = require('./commands/floor.js');
const { handleGateCallback } = require('./commands/gate.js');
const { handleHangar } = require('./commands/hangar.js');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('Missing env var: TELEGRAM_BOT_TOKEN');
  process.exit(1);
}

const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function api(method, payload = {}) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`Telegram ${method} failed: ${JSON.stringify(json)}`);
  return json.result;
}

function makeReplyPayload(reply, opts = {}) {
  if (typeof reply === 'string') {
    return { text: reply, ...opts };
  }
  return { ...reply, ...opts };
}

async function poll() {
  let offset = 0;
  console.log('🤖 Shipyard Telegram bot polling...');

  while (true) {
    try {
      const updates = await api('getUpdates', { offset, timeout: 30 });

      for (const update of updates) {
        offset = update.update_id + 1;

        if (update.message && update.message.text) {
          const raw = update.message.text.trim();
          const text = raw.replace(/@\S+$/, '').trim();
          if (text.startsWith('/inlet')) {
            await handleInlet({ message: update.message, reply: (msg, opts) => api('sendMessage', { chat_id: update.message.chat.id, ...makeReplyPayload(msg, opts) }) });
          } else if (text === '/floor') {
            await handleFloor({ message: update.message, reply: (msg, opts) => api('sendMessage', { chat_id: update.message.chat.id, ...makeReplyPayload(msg, opts) }) });
          } else if (text.startsWith('/hangar')) {
            await handleHangar({ message: update.message, reply: (msg, opts) => api('sendMessage', { chat_id: update.message.chat.id, ...makeReplyPayload(msg, opts) }) });
          } else {
            await api('sendMessage', { chat_id: update.message.chat.id, text: 'Commands: /inlet <text>, /floor, /hangar [query]' });
          }
        }

        if (update.callback_query) {
          const cq = update.callback_query;
          const result = handleGateCallback(cq);

          if (result.ok) {
            await api('editMessageText', {
              chat_id: cq.message.chat.id,
              message_id: cq.message.message_id,
              text: result.text
            });
          }

          await api('answerCallbackQuery', {
            callback_query_id: cq.id,
            text: result.text || 'OK'
          });
        }
      }
    } catch (err) {
      console.error('Poll error:', err.message);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

poll().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
