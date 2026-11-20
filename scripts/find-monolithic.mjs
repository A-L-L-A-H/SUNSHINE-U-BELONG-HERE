#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const IGNORE_DIRS = new Set(['node_modules', '.next', 'dist', '.git', '.turbo', 'coverage', 'build', 'scripts']);
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.scss']);

function isDocumentation(filePath) {
  return /\.(md|mdx|txt)$/.test(filePath) || 
    /(docs?|documentation|eslint-config)/i.test(filePath) ||
    filePath.includes('eslint-config') ||
    filePath.includes('scripts');
}

function isTest(filePath) {
  return /\.(test|spec)\.[cm]?[jt]sx?$/.test(filePath);
}

function scan(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scan(fullPath));
    } else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      if (lines.length > 400 && !isTest(fullPath) && !isDocumentation(fullPath) && !fullPath.includes('navigation.types.ts')) {
        results.push({ file: path.relative(ROOT_DIR, fullPath), lines: lines.length });
      }
    }
  }
  return results;
}

const all = [];
for (const base of ['apps', 'packages']) {
  all.push(...scan(path.join(ROOT_DIR, base)));
}

all.sort((a,b) => b.lines - a.lines);
for (const r of all) {
  console.log(`${r.lines} lines: ${r.file}`);
}
console.log(`Total: ${all.length} files`);