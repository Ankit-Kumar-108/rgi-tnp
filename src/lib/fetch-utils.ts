/**
 * Fetch utility with automatic retry and exponential backoff.
 * Wraps the native fetch API to handle transient network failures gracefully.
 */

import { url } from "inspector";
import { logout, UserRole } from "./auth-client";

interface FetchWithRetryOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  retryOnStatusCodes?: number[];
}

export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {},
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    retryOnStatusCodes = [408, 429, 500, 502, 503, 504],
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);

      // If response is OK or it's a client error (4xx) that isn't retryable, return immediately
      if (response.ok || !retryOnStatusCodes.includes(response.status)) {
        return response;
      }

      // Server error that's retryable — throw to trigger retry
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response; // Return the last failed response if all retries exhausted
    } catch (error: any) {
      lastError = error;

      // Don't retry aborted requests
      if (error?.name === "AbortError") {
        throw error;
      }

      // If we have retries left, wait and try again
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw lastError || new Error("Fetch failed after retries");
}

/**
 * JSON fetch helper with retry — fetches and parses JSON in one call.
 */
export async function fetchJSON<T = any>(
  url: string,
  options: FetchWithRetryOptions = {},
): Promise<T> {
  const response = await fetchWithRetry(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as any)?.message || `HTTP ${response.status}: ${response.statusText}`,
    );
  }
  return response.json() as Promise<T>;
}

/**
 * Authenticated JSON fetch helper — adds Bearer token header automatically.
 */
export async function fetchAuthJSON<T = any>(
  url: string,
  token: string | null,
  options: FetchWithRetryOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetchJSON<T>(url, { ...options, headers });
}

export const fetchWithAuth = async (
  url: string,
  role?: UserRole,
  options: RequestInit = {},
) => {
const response = await fetch(url, options)
if(response.status === 401){
  if(role){ // token expired on server
    logout(role)
  }

  if(typeof window !== 'undefined'){ //redirect to login
    window.location.href = '/login'
  }
}
return response
}
