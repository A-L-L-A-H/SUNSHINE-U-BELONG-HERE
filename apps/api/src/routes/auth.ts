import type { NativeServer } from "@moon/server"
import {
  handleLogin,
  handleRegister,
  handleForgotPassword,
  handleVerifyOtp,
  handleResetPassword,
  handleLogout,
  handleGetSession,
} from "@moon/server/handlers/auth.js"
import { config } from "../config/index.js"

const authConfig = {
  jwtSecret: config.jwtSecret,
  emailFrom: config.email.from,
  emailService: config.email.service,
  emailUser: config.email.user,
  emailPass: config.email.pass,
}

/**
 * ◈ Authentication Routes
 * Registers all auth endpoints from @moon/server handlers
 */
export function registerAuthRoutes(server: NativeServer): void {
  // POST /api/auth/session/login - User login with email/password (matches client expectation)
  server.post("/api/auth/session/login", (req, res) => handleLogin(req, res, authConfig), "none")

  // POST /api/auth/register - User registration
  server.post("/api/auth/register", (req, res) => handleRegister(req, res, authConfig), "none")

  // POST /api/auth/forgot-password - Request password reset OTP
  server.post("/api/auth/forgot-password", (req, res) => handleForgotPassword(req, res, authConfig), "none")

  // POST /api/auth/verify-otp - Verify password reset OTP
  server.post("/api/auth/verify-otp", (req, res) => handleVerifyOtp(req, res, authConfig), "none")

  // POST /api/auth/reset-password - Reset password with verified OTP
  server.post("/api/auth/reset-password", (req, res) => handleResetPassword(req, res, authConfig), "none")

  // POST /api/auth/session/logout - Revoke user sessions (requires auth, matches client expectation)
  server.post("/api/auth/session/logout", (req, res) => handleLogout(req, res, authConfig), "user")

  // GET /api/auth/session - Get current authenticated session (requires auth, matches client expectation)
  server.get("/api/auth/session", (req, res) => handleGetSession(req, res, authConfig), "user")
}