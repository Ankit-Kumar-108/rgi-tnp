"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, LogIn } from "lucide-react";
import Link from "next/link";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[PortalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-brand" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Portal Error
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Something went wrong loading the portal. This may be a temporary issue.
            Try refreshing or log in again if the problem persists.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-brand text-white px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity shadow-[var(--shadow-brand)]"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-muted text-foreground px-6 py-3 rounded-full font-bold text-sm hover:bg-muted/80 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {error.digest && (
          <p className="text-[10px] text-muted-foreground/50 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
