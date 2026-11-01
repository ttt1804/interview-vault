/* iv-analytics — Cloudflare Worker (router)
   Tài khoản Google: POST /auth · GET /me · GET|POST /progress
                     POST /account/delete · POST /admin/grant
   cron: dọn user_activity_day > 90 ngày (dữ liệu cũ, không còn ghi thêm) */
import { cors, json, utcDay } from './lib.js';
import {
  authLogin, getMe, getProgress, putProgress, deleteAccount, adminGrant,
} from './users.js';

const GET = {
  '/me': getMe,
  '/progress': getProgress,
};
const POST = {
  '/auth': authLogin,
  '/progress': putProgress,
  '/account/delete': deleteAccount,
  '/admin/grant': adminGrant,
};

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(env) });

    try {
      if (request.method === 'GET') {
        if (pathname === '/' || pathname === '/health') return json({ ok: true, service: 'iv-analytics' }, 200, env);
        const h = GET[pathname];
        if (h) return await h(request, env);
      }
      if (request.method === 'POST') {
        const h = POST[pathname];
        if (h) return await h(request, env);
      }
    } catch (e) {
      return json({ ok: false, error: 'server', detail: String(e && e.message || e) }, 500, env);
    }
    return json({ ok: false, error: 'not found' }, 404, env);
  },

  async scheduled(event, env, ctx) {
    const cutoff = utcDay(new Date(Date.now() - 90 * 86400000));
    ctx.waitUntil(env.DB.prepare(`DELETE FROM user_activity_day WHERE day < ?`).bind(cutoff).run());
  },
};
