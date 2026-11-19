// Kiểm tra dữ liệu SQL không cần database server: cấu trúc viz và bài tập chạy bằng sql.js.
// Chạy từ gốc repo: node docs/content-review/sql/verify/check-data.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'src/data');
const list = [];
const SS = { addQuestions: (topic, items) => { if (topic === 'sql') list.push(...items); } };
for (const f of readdirSync(dataDir).filter((n) => /^sql-.*\.js$/.test(n)).sort()) {
  new Function('SS', readFileSync(path.join(dataDir, f), 'utf8'))(SS);
}

let bad = 0;
const fail = (q, msg) => { bad++; console.log('LỖI:', q.id, msg); };
for (const q of list) {
  const v = q.viz;
  if (!v) continue;
  if (v.type === 'compare') {
    for (const r of v.rows) if (r.length !== v.cols.length + 1) fail(q, `compare: hàng "${r[0]}" có ${r.length} ô`);
  } else if (v.type === 'flow') {
    for (const s of v.steps) if (!(s.to >= 0 && s.to < v.nodes.length)) fail(q, `flow: to=${s.to}`);
    if (!v.nodes.every((n) => typeof n === 'string')) fail(q, 'flow: node không phải chuỗi');
  } else if (v.type === 'bars') {
    if (!Array.isArray(v.items)) fail(q, 'bars: thiếu items');
  } else if (v.type === 'layers') {
    if (!Array.isArray(v.layers)) fail(q, 'layers: thiếu layers');
  } else if (v.type === 'tree') {
    if (!v.root) fail(q, 'tree: thiếu root');
  } else if (v.type === 'cycle') {
    if (!Array.isArray(v.steps)) fail(q, 'cycle: thiếu steps');
  } else fail(q, `type lạ ${v.type}`);
}

const require = createRequire(import.meta.url);
// Repo khai báo type=module nên nạp file CommonJS của sql.js bằng tay.
const vendorDir = path.join(root, 'assets/vendor');
const mod = { exports: {} };
new Function('module', 'exports', 'require', '__dirname', '__filename',
  readFileSync(path.join(vendorDir, 'sql-wasm.js'), 'utf8'))(mod, mod.exports, require, vendorDir, path.join(vendorDir, 'sql-wasm.js'));
const initSqlJs = mod.exports.default || mod.exports;
const SQL = await initSqlJs({ locateFile: (f) => path.join(root, 'assets/vendor', f) });
let exercises = 0;
for (const q of list.filter((x) => x.code)) {
  exercises++;
  const results = q.code.datasets.map((ds) => {
    const db = new SQL.Database();
    try {
      db.run(q.code.tables); db.run(ds);
      const r = db.exec(q.code.solution);
      return JSON.stringify(r[0]?.values ?? []);
    } catch (e) { fail(q, `bài tập: ${e.message}`); return null; } finally { db.close(); }
  });
  if (results[0] === '[]' && results[1] === '[]') fail(q, 'bài tập: cả hai dataset đều rỗng');
  if (results[0] !== null && results[0] === results[1]) fail(q, 'bài tập: hai dataset cho cùng kết quả');
}
console.log(`${list.length} câu, ${list.filter((q) => q.viz).length} viz, ${exercises} bài tập, ${bad} lỗi`);
process.exit(bad ? 1 : 0);
