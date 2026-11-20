import { NextRequest, NextResponse } from "next/server"
import { APP_PORTS } from "@workspace/types"

export const SESSION_COOKIE = "moon_session"

// Determine API base URL with proper fallback for local development
// In Docker: use service name 'api'
// In local dev: use localhost
// Allow override via env vars
function getApiBaseUrl(): string {
  // Explicit env var takes highest priority
  if (process.env.MOON_API_URL) return process.env.MOON_API_URL
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  
  // In production/Docker, use service name
  if (process.env.NODE_ENV === 'production') {
    return `http://api:${APP_PORTS.API_BACKEND}`
  }
  
  // In development, check if we're in Docker (DOCKER_ENV=1) or local
  // Default to localhost for local development
  if (process.env.DOCKER_ENV === '1') {
    return `http://api:${APP_PORTS.API_BACKEND}`
  }
  
  return `http://localhost:${APP_PORTS.API_BACKEND}`
}

const apiBaseUrl = getApiBaseUrl()

export function getApiUrl(path: string): URL {
  return new URL(path, `${apiBaseUrl.replace(/\/$/, "")}/`)
}

export function isTrustedSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  return Boolean(origin && origin === request.nextUrl.origin)
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  })
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
}

export async function requestApi(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(getApiUrl(path), {
    ...init,
    cache: "no-store",
  })
}
