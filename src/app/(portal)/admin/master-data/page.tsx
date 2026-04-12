"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Database,
  Shield,
  ArrowLeft,
  Loader2,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { toast } from "sonner";

type UploadType = "student" | "alumni";

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });
    return obj;
  });
}

export default function AdminMasterDataPage() {
  const { loading: authLoading, authenticated } = useAuth("admin", "/admin/login");
  const [counts, setCounts] = useState({ studentMaster: 0, alumniMaster: 0 });
  const [loading, setLoading] = useState(true);
  const [uploadType, setUploadType] = useState<UploadType>("student");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authenticated) return;
    fetchCounts();
  }, [authenticated]);

  const fetchCounts = async () => {
    try {
      const res = await fetch("/api/admin/master-data");
      const data = (await res.json()) as { success: boolean; counts: { studentMaster: number; alumniMaster: number } };
      if (data.success) setCounts(data.counts);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch master data counts. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const records = parseCSV(text);
      setPreview(records);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (preview.length === 0) return;
    setUploading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/master-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: uploadType, records: preview }),
      });
      const data = (await res.json()) as { success: boolean; message: string; errors?: string[] };
      const displayMsg = data.errors?.length
        ? `${data.message} | Errors: ${data.errors.join("; ")}`
        : data.message;
      setResult({ success: data.success, message: displayMsg });
      toast[data.success ? "success" : "error"](displayMsg);
      if (data.success) {
        fetchCounts();
        setPreview([]);
        if (fileRef.current) fileRef.current.value = "";
      }
    } catch {
      setResult({ success: false, message: "Upload failed" });
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-muted-foreground hover:text-brand transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand" />
            </div>
            <h1 className="text-lg font-black text-foreground tracking-tight">
              Master Data Management
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Current Counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">
                {loading ? "..." : counts.studentMaster}
              </p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Student Master Records
              </p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">
                {loading ? "..." : counts.alumniMaster}
              </p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Alumni Master Records
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-brand" />
            Upload CSV
          </h2>

          {/* Type Selection */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => { setUploadType("student"); setPreview([]); setResult(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${uploadType === "student"
                  ? "bg-brand text-white shadow-lg shadow-brand/20"
                  : "bg-muted border border-border text-muted-foreground hover:text-foreground"
                }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student Master
            </button>
            <button
              onClick={() => { setUploadType("alumni"); setPreview([]); setResult(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${uploadType === "alumni"
                  ? "bg-brand text-white shadow-lg shadow-brand/20"
                  : "bg-muted border border-border text-muted-foreground hover:text-foreground"
                }`}
            >
              <UserCheck className="w-4 h-4" />
              Alumni Master
            </button>
          </div>

          {/* CSV Format Hint */}
          <div className="bg-muted/50 p-4 rounded-xl mb-6 border border-border/50">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Expected CSV Format</p>
            <code className="text-xs text-foreground font-mono">
              {uploadType === "student"
                ? "enrollmentNumber, name, branch, course, batch"
                : "enrollmentNumber, name, branch, course, batch"}
            </code>
          </div>

          {/* File Input */}
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-brand/50 transition-colors">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Drop your CSV file here or click to browse
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="bg-brand text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-brand/90 transition-all cursor-pointer"
            >
              Choose File
            </label>
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-foreground">
                  Preview ({preview.length} records)
                </p>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Uploading..." : "Upload Now"}
                </button>
              </div>
              <div className="overflow-x-auto max-h-64 overflow-y-auto rounded-xl border border-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border sticky top-0">
                      {Object.keys(preview[0]).map((key) => (
                        <th key={key} className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 20).map((row, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-3 py-2 text-foreground">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {preview.length > 20 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Showing first 20 of {preview.length} records
                </p>
              )}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-xl ${result.success
                ? "bg-green-500/10 text-green-600"
                : "bg-red-500/10 text-red-500"
              }`}>
              {result.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <p className="text-sm font-medium">{result.message}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
