import { describe, it, expect } from 'vitest'

describe('@workspace/eslint-config', () => {
  it('exports base, next-js, and react-internal configs', () => {
    const base = import('@workspace/eslint-config/base')
    const nextJs = import('@workspace/eslint-config/next-js')
    const reactInternal = import('@workspace/eslint-config/react-internal')
    expect(base).toBeDefined()
    expect(nextJs).toBeDefined()
    expect(reactInternal).toBeDefined()
  })
})
