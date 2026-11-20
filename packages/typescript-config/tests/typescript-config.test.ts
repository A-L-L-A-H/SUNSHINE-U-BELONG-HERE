import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('@workspace/typescript-config', () => {
  const pkgRoot = resolve(__dirname, '..')
  const basePath = resolve(pkgRoot, 'base.json')

  it('base.json exists and is valid JSON', () => {
    const base = JSON.parse(readFileSync(basePath, 'utf-8'))
    expect(base).toBeDefined()
    expect(base.compilerOptions).toBeDefined()
  })

  it('has strict mode enabled', () => {
    const base = JSON.parse(readFileSync(basePath, 'utf-8'))
    expect(base.compilerOptions.strict).toBe(true)
  })
})
