// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from './card'

describe('Card', () => {
  it('renders with default props', () => {
    const { container } = render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card"]')).toHaveClass('bg-card')
  })

  it('renders with sm size', () => {
    const { container } = render(<Card size="sm">Small card</Card>)
    expect(container.querySelector('[data-slot="card"]')).toHaveAttribute('data-size', 'sm')
  })

  it('renders CardHeader', () => {
    const { container } = render(
      <Card>
        <CardHeader>Header</CardHeader>
      </Card>
    )
    expect(container.querySelector('[data-slot="card-header"]')).toBeInTheDocument()
  })

  it('renders CardTitle', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(container.querySelector('[data-slot="card-title"]')).toHaveTextContent('Title')
    expect(container.querySelector('[data-slot="card-title"]')).toHaveClass('font-semibold')
  })

  it('renders CardDescription', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardDescription>Description</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(container.querySelector('[data-slot="card-description"]')).toHaveTextContent('Description')
    expect(container.querySelector('[data-slot="card-description"]')).toHaveClass('text-muted-foreground')
  })

  it('renders CardContent', () => {
    const { container } = render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(container.querySelector('[data-slot="card-content"]')).toBeInTheDocument()
  })

  it('renders CardFooter', () => {
    const { container } = render(
      <Card>
        <CardFooter>Footer</CardFooter>
      </Card>
    )
    expect(container.querySelector('[data-slot="card-footer"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="card-footer"]')).toHaveClass('border-t')
  })

  it('renders CardAction', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardAction>Action</CardAction>
        </CardHeader>
      </Card>
    )
    expect(container.querySelector('[data-slot="card-action"]')).toBeInTheDocument()
  })

  it('forwards className prop', () => {
    const { container } = render(<Card className="custom-card">Content</Card>)
    expect(container.querySelector('[data-slot="card"]')).toHaveClass('custom-card')
  })

  it('composes all sub-components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Main content</CardContent>
        <CardFooter>Footer content</CardFooter>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Main content')).toBeInTheDocument()
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })
})