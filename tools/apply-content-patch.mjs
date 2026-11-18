// Áp bản vá nội dung theo kiểu "tất cả hoặc không gì cả".
//
// Cách dùng:
//   node tools/apply-content-patch.mjs <patch.txt>           # áp bản vá
//   node tools/apply-content-patch.mjs <patch.txt> --check   # chỉ kiểm tra, không ghi file
//
// Định dạng bản vá (đoạn cũ và đoạn mới được so khớp nguyên văn, không escape):
//   @@ src/data/java-01-oop.js
//   <<<
//   đoạn cũ, phải khớp đúng một chỗ
//   ===
//   đoạn mới
//   >>>
//
// Công cụ từ chối sửa dòng `q:` hoặc `id:` vì đổi chúng làm hỏng permalink và tiến độ đã lưu.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOCKED_FIELD = /^\s*(q|id):\s/m;

function fail(message) {
  console.error(`Lỗi: ${message}`);
  process.exit(1);
}

// Tách file bản vá thành từng nhóm theo file đích.
function parsePatch(text) {
  const groups = [];
  let group = null;
  let edit = null;
  let mode = 'ngoai';

  text.replace(/\r\n/g, '\n').split('\n').forEach((line, index) => {
    const lineNo = index + 1;
    if (mode === 'ngoai') {
      if (line.startsWith('@@ ')) {
        group = { file: line.slice(3).trim(), edits: [] };
        groups.push(group);
      } else if (line === '<<<') {
        if (!group) fail(`dòng ${lineNo}: thiếu "@@ <file>" trước "<<<"`);
        edit = { lineNo, oldLines: [], newLines: [] };
        mode = 'cu';
      } else if (line.trim() !== '') {
        fail(`dòng ${lineNo}: nội dung nằm ngoài khối sửa`);
      }
    } else if (mode === 'cu') {
      if (line === '===') mode = 'moi';
      else edit.oldLines.push(line);
    } else if (line === '>>>') {
      group.edits.push(edit);
      edit = null;
      mode = 'ngoai';
    } else {
      edit.newLines.push(line);
    }
  });

  if (mode !== 'ngoai') fail(`khối sửa bắt đầu ở dòng ${edit.lineNo} chưa được đóng`);
  return groups;
}

function targetPath(file) {
  const path = resolve(ROOT, file);
  const fromRoot = relative(ROOT, path);
  if (fromRoot.startsWith('..') || isAbsolute(fromRoot)) fail(`file nằm ngoài repo: ${file}`);
  if (!existsSync(path)) fail(`không tìm thấy file: ${file}`);
  return path;
}

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const patchFile = args.find((arg) => arg !== '--check');
if (!patchFile) fail('cách dùng: node tools/apply-content-patch.mjs <patch.txt> [--check]');
if (!existsSync(patchFile)) fail(`không tìm thấy bản vá: ${patchFile}`);

const groups = parsePatch(readFileSync(patchFile, 'utf8'));
const outputs = new Map();
const problems = [];
let total = 0;

for (const group of groups) {
  const path = targetPath(group.file);
  const original = outputs.has(path) ? outputs.get(path).content : readFileSync(path, 'utf8');
  const usesCrlf = original.includes('\r\n');
  let content = original.replace(/\r\n/g, '\n');

  for (const edit of group.edits) {
    total += 1;
    const oldText = edit.oldLines.join('\n');
    const newText = edit.newLines.join('\n');
    const where = `${group.file}, khối ở dòng ${edit.lineNo} của bản vá`;
    if (!oldText) {
      problems.push(`${where}: đoạn cũ đang rỗng`);
    } else if (oldText === newText) {
      problems.push(`${where}: đoạn mới không có thay đổi`);
    } else if (LOCKED_FIELD.test(oldText) || LOCKED_FIELD.test(newText)) {
      problems.push(`${where}: không được sửa dòng q: hoặc id:`);
    } else {
      const count = content.split(oldText).length - 1;
      if (count !== 1) problems.push(`${where}: đoạn cũ khớp ${count} chỗ, cần đúng 1 chỗ`);
      else content = content.replace(oldText, () => newText);
    }
  }

  outputs.set(path, { content: usesCrlf ? content.replace(/\n/g, '\r\n') : content });
}

if (problems.length) {
  problems.forEach((problem) => console.error(`- ${problem}`));
  fail(`có ${problems.length} khối không áp được, chưa ghi file nào`);
}

if (!checkOnly) {
  for (const [path, output] of outputs) writeFileSync(path, output.content);
}
console.log(`${checkOnly ? 'Hợp lệ' : 'Đã áp'}: ${total} khối sửa trên ${outputs.size} file.`);
