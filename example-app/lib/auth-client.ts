/**
 * Better Auth Client
 *
 * Client-side authentication utilities for use in components and client code.
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Export SessionProvider for app-wide session management
export const SessionProvider = authClient.SessionProvider;
