import fs from 'node:fs'
import path from 'node:path'

const ROOT_DIR = process.cwd()
const IGNORE = new Set(['node_modules', '.next', 'dist', '.git', '.turbo', 'coverage', 'build', 'scripts', '.agents'])

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (/\.(ts|tsx|js|jsx|mjs|cjs|css|scss)$/.test(entry.name)) files.push(full)
  }
  return files
}

const files = walk(path.join(ROOT_DIR, 'apps')).concat(walk(path.join(ROOT_DIR, 'packages')))
const rows = []
for (const f of files) {
  const lines = fs.readFileSync(f, 'utf8').split('\n')
  if (lines.length > 400 && !f.includes('navigation.types.ts')) {
    rows.push([lines.length, path.relative(ROOT_DIR, f)])
  }
}
rows.sort((a, b) => b[0] - a[0])
for (const [n, f] of rows) console.log(String(n).padStart(5) + '  ' + f)
console.log('Total: ' + rows.length + ' files')
