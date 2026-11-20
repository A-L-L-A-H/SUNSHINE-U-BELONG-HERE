// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './select'

describe('Select', () => {
  it('renders trigger with placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Select>
        <SelectTrigger size="sm">
          <SelectValue placeholder="Small" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'sm')

    rerender(
      <Select>
        <SelectTrigger size="default">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'default')
  })

  it('forwards className to trigger', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByRole('combobox')).toHaveClass('custom-trigger')
  })

  it('renders multiple select items', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Beta</SelectItem>
          <SelectItem value="c">Gamma</SelectItem>
        </SelectContent>
      </Select>
    )

    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /alpha/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /beta/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /gamma/i })).toBeInTheDocument()
  })

  it('forwards ref to SelectTrigger', () => {
    const ref = vi.fn()
    render(
      <Select>
        <SelectTrigger ref={ref}>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">One</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(ref).toHaveBeenCalled()
  })
})