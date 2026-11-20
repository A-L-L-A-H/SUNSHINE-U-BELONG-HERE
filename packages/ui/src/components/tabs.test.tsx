// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

describe('Tabs', () => {
  it('renders tabs list with triggers', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab One</TabsTrigger>
          <TabsTrigger value="tab2">Tab Two</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content One</TabsContent>
        <TabsContent value="tab2">Content Two</TabsContent>
      </Tabs>
    )

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /tab one/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /tab two/i })).toBeInTheDocument()
  })

  it('shows content for active tab', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab One</TabsTrigger>
          <TabsTrigger value="tab2">Tab Two</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content One</TabsContent>
        <TabsContent value="tab2">Content Two</TabsContent>
      </Tabs>
    )

    expect(screen.getByText('Content One')).toBeInTheDocument()
    expect(screen.queryByText('Content Two')).not.toBeInTheDocument()
  })

  it('switches content when tab clicked', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab One</TabsTrigger>
          <TabsTrigger value="tab2">Tab Two</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content One</TabsContent>
        <TabsContent value="tab2">Content Two</TabsContent>
      </Tabs>
    )

    fireEvent.click(screen.getByRole('tab', { name: /tab two/i }))
    expect(screen.getByText('Content Two')).toBeInTheDocument()
    expect(screen.queryByText('Content One')).not.toBeInTheDocument()
  })

  it('renders with line variant', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList variant="line">
          <TabsTrigger value="tab1">Tab One</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    )

    expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', 'line')
  })

  it('forwards className to Tabs', () => {
    render(
      <Tabs defaultValue="tab1" className="custom-tabs">
        <TabsList>
          <TabsTrigger value="tab1">Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    )

    expect(screen.getByRole('tablist').parentElement).toHaveClass('custom-tabs')
  })
})