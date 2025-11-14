/**
 * Better Auth API Route Handler
 *
 * Handles all authentication-related API requests:
 * - POST /api/auth/sign-up/email - Register new user
 * - POST /api/auth/sign-in/email - Login user
 * - POST /api/auth/sign-out - Logout user
 * - GET  /api/auth/get-session - Get current session
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
