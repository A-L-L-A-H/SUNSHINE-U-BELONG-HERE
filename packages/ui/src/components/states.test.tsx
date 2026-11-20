// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  EmptyState,
  LoadingState,
  SkeletonCard,
  ErrorState,
  StatusNotice,
  ErrorNotice,
} from './states'

describe('EmptyState', () => {
  it('renders with default props', () => {
    render(<EmptyState />)
    expect(screen.getByText('No data available')).toBeInTheDocument()
    expect(screen.getByText('There are no records to display at this time.')).toBeInTheDocument()
  })

  it('renders with custom title and description', () => {
    render(<EmptyState title="Custom Title" description="Custom description" />)
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom description')).toBeInTheDocument()
  })

  it('renders action when provided', () => {
    const action = <button>Action</button>
    render(<EmptyState action={action} />)
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<EmptyState className="custom-empty" />)
    expect(container.firstChild).toHaveClass('custom-empty')
  })
})

describe('LoadingState', () => {
  it('renders with default props', () => {
    render(<LoadingState />)
    expect(screen.getByText('Loading data')).toBeInTheDocument()
    expect(screen.getByText('Retrieving information from sources...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
  })

  it('renders with custom lines', () => {
    const { container } = render(<LoadingState lines={5} />)
    const skeletonLines = container.querySelectorAll('.animate-pulse')
    expect(skeletonLines).toHaveLength(5)
  })

  it('forwards className', () => {
    const { container } = render(<LoadingState className="custom-loading" />)
    expect(container.firstChild).toHaveClass('custom-loading')
  })
})

describe('SkeletonCard', () => {
  it('renders with default props', () => {
    const { container } = render(<SkeletonCard />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<SkeletonCard className="custom-skeleton" />)
    expect(container.firstChild).toHaveClass('custom-skeleton')
  })
})

describe('ErrorState', () => {
  it('renders with default props', () => {
    render(<ErrorState />)
    expect(screen.getByText('Unable to load data')).toBeInTheDocument()
    expect(screen.getByText('A connection or source error occurred. Please try again.')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders with custom title and description', () => {
    render(<ErrorState title="Custom Error" description="Custom error description" />)
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText('Custom error description')).toBeInTheDocument()
  })

  it('renders error code when provided', () => {
    render(<ErrorState errorCode="ERR_CONNECTION" />)
    expect(screen.getByText('Error code: ERR_CONNECTION')).toBeInTheDocument()
  })

  it('calls onRetry when retry button clicked', () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: /retry/i }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('does not render retry button when onRetry not provided', () => {
    render(<ErrorState />)
    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<ErrorState className="custom-error" />)
    expect(container.firstChild).toHaveClass('custom-error')
  })
})

describe('StatusNotice', () => {
  it('renders with default variant info', () => {
    render(<StatusNotice message="Info message" />)
    expect(screen.getByText('Info message')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveClass('border-info/30')
  })

  it('renders with success variant', () => {
    render(<StatusNotice variant="success" message="Success" />)
    expect(screen.getByRole('status')).toHaveClass('border-success/30')
    expect(screen.getByRole('status')).toHaveClass('bg-success/10')
  })

  it('renders with warning variant', () => {
    render(<StatusNotice variant="warning" message="Warning" />)
    expect(screen.getByRole('status')).toHaveClass('border-warning/30')
  })

  it('renders with destructive variant', () => {
    render(<StatusNotice variant="destructive" message="Error" />)
    expect(screen.getByRole('alert')).toHaveClass('border-destructive/30')
  })

  it('renders with neutral variant', () => {
    render(<StatusNotice variant="neutral" message="Neutral" />)
    expect(screen.getByRole('status')).toHaveClass('border-border')
  })

  it('renders title when provided', () => {
    render(<StatusNotice title="Title" message="Message" />)
    expect(screen.getByText('Title')).toHaveClass('font-semibold')
    expect(screen.getByText('Message')).toHaveClass('text-xs')
  })

  it('renders action when provided', () => {
    const action = <button>Action</button>
    render(<StatusNotice message="Message" action={action} />)
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    const icon = <span data-testid="icon">Icon</span>
    render(<StatusNotice message="Message" icon={icon} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders children over message', () => {
    render(<StatusNotice message="Message">Children content</StatusNotice>)
    expect(screen.getByText('Children content')).toBeInTheDocument()
    expect(screen.queryByText('Message')).not.toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<StatusNotice message="Message" className="custom-notice" />)
    expect(container.firstChild).toHaveClass('custom-notice')
  })
})

describe('ErrorNotice', () => {
  it('renders with default message', () => {
    render(<ErrorNotice />)
    expect(screen.getByText('Content is temporarily unavailable.')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('border-destructive/30')
  })

  it('renders with custom message', () => {
    render(<ErrorNotice message="Custom error" />)
    expect(screen.getByText('Custom error')).toBeInTheDocument()
  })

  it('renders children over message', () => {
    render(<ErrorNotice>Children error</ErrorNotice>)
    expect(screen.getByText('Children error')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<ErrorNotice className="custom-error-notice" />)
    expect(container.firstChild).toHaveClass('custom-error-notice')
  })
})