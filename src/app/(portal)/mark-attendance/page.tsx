"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getToken } from "@/lib/auth-client";
import { CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";

type Status = "loading" | "success" | "already" | "error" | "no-token";

export default function MarkAttendancePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const attendanceToken = searchParams.get("token");

  const [status, setStatus] = useState<Status>("loading");
  const [driveName, setDriveName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // If there's no token in the URL, something is wrong
    if (!attendanceToken) {
      setStatus("no-token");
      return;
    }

    // Check if student is logged in (either internal or external)
    const studentToken = getToken("student") || getToken("external_student");

    if (!studentToken) {
      // Not logged in → send them to login, then bring them back here
      const returnUrl = `/mark-attendance?token=${attendanceToken}`;
      router.push(`/students/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Student IS logged in → mark attendance
    const markAttendance = async () => {
      try {
        const res = await fetch("/api/student/attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${studentToken}`,
          },
          body: JSON.stringify({ attendanceToken }),
        });

        const data = (await res.json()) as {
          success?: boolean;
          message?: string;
          driveName?: string;
          alreadyMarked?: boolean;
        };

        if (data.success && data.alreadyMarked) {
          setStatus("already");
          setDriveName(data.driveName || "");
        } else if (data.success) {
          setStatus("success");
          setDriveName(data.driveName || "");
        } else {
          setStatus("error");
          setErrorMessage(data.message || "Something went wrong");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      }
    };

    markAttendance();
  }, [attendanceToken, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 text-center shadow-lg">

        {/* LOADING */}
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-brand animate-spin" />
            <h1 className="text-xl font-black text-foreground">Marking Attendance...</h1>
            <p className="text-sm text-muted-foreground mt-2">Please wait a moment</p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black text-foreground">Attendance Marked! ✅</h1>
            <p className="text-base text-muted-foreground mt-2">
              You&apos;re marked present for <span className="font-bold text-brand">{driveName}</span>
            </p>
            <Link href="/students/dashboard"
              className="inline-block mt-6 px-6 py-2.5 bg-brand text-white rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
              Go to Dashboard
            </Link>
          </>
        )}

        {/* ALREADY MARKED */}
        {status === "already" && (
          <>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-black text-foreground">Already Present!</h1>
            <p className="text-base text-muted-foreground mt-2">
              Your attendance for <span className="font-bold text-brand">{driveName}</span> was already recorded.
            </p>
            <Link href="/students/dashboard"
              className="inline-block mt-6 px-6 py-2.5 bg-brand text-white rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
              Go to Dashboard
            </Link>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-black text-foreground">Oops!</h1>
            <p className="text-base text-muted-foreground mt-2">{errorMessage}</p>
            <Link href="/students/dashboard"
              className="inline-block mt-6 px-6 py-2.5 bg-muted text-foreground rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
              Go to Dashboard
            </Link>
          </>
        )}

        {/* NO TOKEN IN URL */}
        {status === "no-token" && (
          <>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-2xl font-black text-foreground">Invalid QR Code</h1>
            <p className="text-base text-muted-foreground mt-2">
              This link doesn&apos;t contain a valid attendance token. Please scan the QR code again.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
