// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CommandCenterLoginView } from './login-view'
import { useAuthSession } from '@moon/client'
import { useRouter } from 'next/navigation'

vi.mock('@moon/client', () => ({
  useAuthSession: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('@workspace/ui', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Input: ({ ...props }: any) => <input {...props} />,
  StatusNotice: ({ message, ...props }: any) => <div {...props}>{message}</div>,
  soundEngine: {
    playClick: vi.fn(),
    playSuccessChime: vi.fn(),
    playAlertTone: vi.fn(),
  },
}))

describe('CommandCenterLoginView', () => {
  const mockLogin = vi.fn()
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useAuthSession as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
    })
    ;(useRouter as any).mockReturnValue({
      push: mockPush,
    })
  })

  it('renders login form with email and password fields', () => {
    render(<CommandCenterLoginView />)
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders demo account preset buttons', () => {
    render(<CommandCenterLoginView />)
    expect(screen.getByRole('button', { name: /supervisor/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /administrator/i })).toBeInTheDocument()
  })

  it('sets email and password when demo preset clicked', () => {
    render(<CommandCenterLoginView />)
    fireEvent.click(screen.getByRole('button', { name: /supervisor/i }))
    expect(screen.getByLabelText(/email address/i)).toHaveValue('commander@moonwitness.os')
    expect(screen.getByLabelText(/password/i)).toHaveValue('password123')
  })

  it('calls login and redirects on successful submit', async () => {
    mockLogin.mockResolvedValue(undefined)
    render(<CommandCenterLoginView />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({
      email: 'commander@moonwitness.os',
      password: 'password123',
    }))
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'))
  })

  it('shows error message on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'))
    render(<CommandCenterLoginView />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument())
  })

  it('disables submit button during loading', async () => {
    let resolveLogin: Function
    mockLogin.mockImplementation(() => new Promise((resolve) => { resolveLogin = resolve }))
    render(<CommandCenterLoginView />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled())
    resolveLogin()
  })

  it('shows loading spinner during login', async () => {
    let resolveLogin: Function
    mockLogin.mockImplementation(() => new Promise((resolve) => { resolveLogin = resolve }))
    render(<CommandCenterLoginView />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument())
    resolveLogin()
  })

  it('clears error message on new submit attempt', async () => {
    mockLogin
      .mockRejectedValueOnce(new Error('Invalid credentials'))
      .mockResolvedValueOnce(undefined)
    render(<CommandCenterLoginView />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument())
  })
})