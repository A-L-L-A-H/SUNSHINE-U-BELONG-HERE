import { describe, it, expect } from 'vitest'
import { sanitizeHtml, escapeHtml } from '../../src/lib/sanitize-html.js'

describe('@workspace/ui lib/sanitize-html', () => {
  it('strips script tags', () => {
    const result = sanitizeHtml('Hello <script>alert("xss")</script> World')
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('alert')
  })

  it('strips iframe tags', () => {
    const result = sanitizeHtml('<iframe src="evil.com"></iframe>')
    expect(result).not.toContain('<iframe>')
  })

  it('strips object and embed tags', () => {
    expect(sanitizeHtml('<object></object>')).not.toContain('<object>')
    expect(sanitizeHtml('<embed src="x.swf">')).not.toContain('<embed>')
  })

  it('strips inline event handlers', () => {
    const result = sanitizeHtml('<div onclick="evil()">Click</div>')
    expect(result).not.toContain('onclick')
  })

  it('blocks javascript: URLs', () => {
    const result = sanitizeHtml('<a href="javascript:evil()">link</a>')
    expect(result).not.toContain('javascript:')
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeHtml('')).toBe('')
    expect(sanitizeHtml(null as unknown as string)).toBe('')
  })

  it('escapes HTML special characters', () => {
    expect(escapeHtml('<div>test</div>')).toBe('&lt;div&gt;test&lt;/div&gt;')
    expect(escapeHtml('"quotes"')).toBe('&quot;quotes&quot;')
    expect(escapeHtml("'apostrophe'")).toBe('&#039;apostrophe&#039;')
  })

  it('returns empty string for non-string escape input', () => {
    expect(escapeHtml('')).toBe('')
    expect(escapeHtml(null as unknown as string)).toBe('')
  })
})
