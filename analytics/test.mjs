/* Kiểm chứng Worker mà KHÔNG cần deploy lên Cloudflare.
   Chạy schema.sql + Worker thật trên SQLite trong bộ nhớ (sql.js có sẵn trong assets/vendor)
   qua một shim tối giản của API D1.

   Chạy:  node analytics/test.mjs          (từ gốc repo hoặc từ analytics/)
   Thoát mã 1 nếu có assertion sai — dùng được trong CI. */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* Node cũ chưa có sẵn các global mà Worker dùng */
globalThis.crypto ??= webcrypto;
globalThis.Response ??= class {
  constructor(body, init = {}) { this.body = body; this.status = init.status ?? 200; this.headers = init.headers; }
  async json() { return JSON.parse(this.body); }
};

const HERE = dirname(fileURLToPath(import.meta.url));
const { default: worker } = await import('./src/worker.js');
const { signSession } = await import('./src/auth.js');

/* package.json gốc đặt type=module nên không require() được file UMD này */
const VENDOR = join(HERE, '..', 'assets', 'vendor');
const mod = { exports: {} };
new Function('module', 'exports', 'require', '__dirname', readFileSync(join(VENDOR, 'sql-wasm.js'), 'utf8'))(
  mod, mod.exports, createRequire(import.meta.url), VENDOR
);
const SQL = await mod.exports({ wasmBinary: readFileSync(join(VENDOR, 'sql-wasm.wasm')) });
const db = new SQL.Database();
db.exec(readFileSync(join(HERE, 'schema.sql'), 'utf8'));

/* ---- shim tối giản của D1 ---- */
function rows(sql, params) {
  const st = db.prepare(sql);
  st.bind(params);
  const out = [];
  while (st.step()) out.push(st.getAsObject());
  st.free();
  return out;
}
const wrap = (sql, params = []) => ({
  bind: (...args) => wrap(sql, args),
  first: async () => rows(sql, params)[0] ?? null,
  all: async () => ({ results: rows(sql, params), success: true }),
  run: async () => { rows(sql, params); return { success: true }; },
});
const env = {
  ALLOW_ORIGIN: '',
  SESSION_SECRET: 'test-secret',
  DB: { prepare: (sql) => wrap(sql), batch: async (stmts) => Promise.all(stmts.map((s) => s.run())) },
};

const call = (method, path, { token, body } = {}) => worker.fetch({
  method,
  url: 'https://worker.test' + path,
  headers: { get: (k) => (k.toLowerCase() === 'authorization' && token ? 'Bearer ' + token : null) },
  text: async () => JSON.stringify(body ?? {}),
}, env);

let failed = 0;
function check(name, ok, detail) {
  if (ok) { console.log('ok   ' + name); return; }
  failed++;
  console.error('FAIL ' + name + (detail === undefined ? '' : ' -> ' + JSON.stringify(detail)));
}
const count = (table) => rows('SELECT COUNT(*) AS n FROM ' + table, [])[0].n;

/* ---- thống kê và bảng xếp hạng đã gỡ ---- */
for (const [m, p] of [['GET', '/stats'], ['POST', '/collect'], ['GET', '/leaderboard'], ['POST', '/settings']]) {
  const r = await call(m, p);
  check(m + ' ' + p + ' trả 404', r.status === 404, r.status);
}
const tables = rows("SELECT name FROM sqlite_master WHERE type='table'", []).map((t) => t.name);
check('schema không còn bảng thống kê',
  !tables.some((t) => ['visitor', 'visitor_day', 'daily', 'daily_topic', 'visitor_ip', 'ip_day'].includes(t)), tables);

/* ---- route còn lại ---- */
check('GET /health', (await call('GET', '/health')).status === 200);
check('GET /me chưa đăng nhập trả 401', (await call('GET', '/me')).status === 401);

rows("INSERT INTO app_user (sub, email, name, picture, created_day, last_seen_day) VALUES ('u1', 'a@test', 'A', '', '2026-01-01', '2026-01-01')", []);
const token = await signSession({ sub: 'u1', name: 'A', picture: '' }, env.SESSION_SECRET);

const me = await (await call('GET', '/me', { token })).json();
check('GET /me trả hồ sơ', me.ok && me.user.name === 'A', me);
check('hồ sơ không còn trường bảng xếp hạng', me.user && !('displayName' in me.user) && !('showOnLeaderboard' in me.user), me.user);

const data = { srs: {}, learned: { 'java-a': 1 }, log: { '2026-01-01': 3 }, resets: { kafka: 100 } };
const saved = await (await call('POST', '/progress', { token, body: { data } })).json();
check('POST /progress', saved.ok && saved.rev === 1, saved);
const got = await (await call('GET', '/progress', { token })).json();
check('GET /progress giữ nguyên blob, kể cả resets', JSON.stringify(got.data) === JSON.stringify(data), got);
check('POST /progress không ghi user_activity_day', count('user_activity_day') === 0);

/* ---- dữ liệu cũ: cron dọn dần, xoá tài khoản xoá sạch ---- */
rows("INSERT INTO user_activity_day (sub, day, reviews) VALUES ('old', '2000-01-01', 5), ('u1', '2999-01-01', 5)", []);
await worker.scheduled({}, env, { waitUntil: (p) => p });
check('cron dọn dữ liệu quá 90 ngày', rows("SELECT * FROM user_activity_day WHERE sub = 'old'", []).length === 0);

const del = await (await call('POST', '/account/delete', { token })).json();
check('POST /account/delete', del.ok, del);
check('xoá sạch dữ liệu của người dùng',
  count('app_user') === 0 && count('user_progress') === 0 && count('user_activity_day') === 0);

if (failed) { console.error(failed + ' lỗi'); process.exit(1); }
console.log('Tất cả đều qua.');
