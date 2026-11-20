// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './input'

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('data-slot', 'input')
    expect(input).toHaveClass('border-input')
  })

  it('renders with different types', () => {
    const { rerender, container } = render(<Input type="text" />)
    expect(container.querySelector('[data-slot="input"]')).toHaveAttribute('type', 'text')

    rerender(<Input type="email" />)
    expect(container.querySelector('[data-slot="input"]')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    expect(container.querySelector('[data-slot="input"]')).toHaveAttribute('type', 'password')
  })

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled" />)
    const input = screen.getByPlaceholderText('Disabled')
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('data-slot', 'input')
    expect(input).toHaveClass('disabled:opacity-50')
  })

  it('forwards className prop', () => {
    const { container } = render(<Input className="custom-input" />)
    const input = container.querySelector('[data-slot="input"]') as HTMLElement
    expect(input).toHaveClass('custom-input')
  })

  it('forwards ref', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('renders with value prop', () => {
    render(<Input defaultValue="test value" />)
    expect(screen.getByDisplayValue('test value')).toHaveAttribute('data-slot', 'input')
  })

  it('handles onChange', () => {
    const handleChange = vi.fn()
    const { container } = render(<Input onChange={handleChange} />)
    const input = container.querySelector('[data-slot="input"]') as HTMLElement
    fireEvent.change(input, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalled()
  })
})