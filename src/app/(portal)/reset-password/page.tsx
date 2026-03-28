"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  
  // CRITICAL FIX: Prevents the API from firing twice in React Strict Mode
  const hasAttempted = useRef(false);

  const token = searchParams?.get("token");
  const email = searchParams?.get("email");
  const role = searchParams?.get("role");

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid verification link. Please check your email again.");
      return;
    }

    // If we already tried verifying, stop here.
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email, role }),
        });
        const data = await res.json() as any;
        
        if (data.success) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed");
        }
      } catch (err) {
        setStatus("error");
        setMessage("An error occurred during verification. Please try again later.");
      }
    };

    verify();
  }, [token, email, role]); // Added role to dependencies

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-md w-full bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl text-center">
        <div className="w-20 h-20 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          {status === "loading" && <Loader2 className="w-10 h-10 text-brand animate-spin" />}
          {status === "success" && <CheckCircle className="w-10 h-10 text-green-500" />}
          {status === "error" && <XCircle className="w-10 h-10 text-red-500" />}
        </div>

        <h1 className="text-2xl font-black text-foreground mb-3 tracking-tight">
          {status === "loading" && "Verifying Email..."}
          {status === "success" && "Successfully Verified!"}
          {status === "error" && "Verification Failed"}
        </h1>

        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          {message || "Please wait while we confirm your email address and activate your account."}
        </p>

        {status !== "loading" && (
          <div className="space-y-3">
            <Link
              href="/students/login"
              className="flex items-center justify-center gap-2 w-full py-3 bg-brand text-primary-foreground rounded-xl font-bold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 group"
            >
              Go to Login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {status === "error" && (
              <button
                onClick={() => window.location.reload()}
                className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {status === "loading" && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs animate-pulse">
            <Mail className="w-3 h-3" />
            Security Check in Progress
          </div>
        )}
      </div>
    </div>
  );
}

// Your Suspense boundary is perfect!
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}