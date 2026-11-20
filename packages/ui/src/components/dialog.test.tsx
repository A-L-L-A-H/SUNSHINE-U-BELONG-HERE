// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog'

describe('Dialog', () => {
  it('renders trigger and opens on click', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test dialog</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button>Close</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByRole('button', { name: /open dialog/i })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /open dialog/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Dialog')).toBeInTheDocument()
    expect(screen.getByText('This is a test dialog')).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="custom-dialog">
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    fireEvent.click(screen.getByRole('button', { name: /open/i }))
    expect(screen.getByRole('dialog')).toHaveClass('custom-dialog')
  })

  it('forwards ref to DialogContent', () => {
    const ref = vi.fn()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent ref={ref}>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    fireEvent.click(screen.getByRole('button', { name: /open/i }))
    expect(ref).toHaveBeenCalled()
  })
})