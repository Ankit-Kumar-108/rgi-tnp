"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";
import {
  QrCode,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ChevronDown,
  Download,
} from "lucide-react";
import { getToken } from "@/lib/auth-client";

interface Drive {
  id: string;
  companyName: string;
  driveDate: string;
  status?: string;
}

export default function VolunteerAttendanceQR() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [showQrModal, setShowQrModal] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [qrDriveName, setQrDriveName] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrExpiresAt, setQrExpiresAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const token = getToken("student");
        const res = await fetch("/api/volunteer/drives", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = (await res.json()) as {
          success: boolean;
          drives: Drive[];
        };
        if (data.success && data.drives) {
          // The API already filters for active drives
          const sorted = data.drives.sort(
            (a, b) => new Date(b.driveDate).getTime() - new Date(a.driveDate).getTime(),
          );
          setDrives(sorted);
        }
      } catch (error) {
        console.error("Error fetching drives:", error);
        toast.error("Failed to fetch drives");
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  useEffect(() => {
    if (!qrImageUrl || !qrExpiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const difference = qrExpiresAt - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, [qrImageUrl, qrExpiresAt]);

  const generateQr = async () => {
    if (!selectedDrive) return;

    setQrLoading(true);
    setQrImageUrl(""); // Clear old QR
    
    try {
      const token = getToken("student");
      const res = await fetch(`/api/volunteer/drives/${selectedDrive}/attendance-qr`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as any;
      if (data.success) {
        setQrDriveName(data.driveName);
        setQrExpiresAt(data.expiresAt);
        const imgUrl = await QRCode.toDataURL(data.qrUrl, { width: 400, margin: 2 });
        setQrImageUrl(imgUrl);
        setShowQrModal(true);
      } else {
        toast.error(data.message || "Failed to generate QR");
      }
    } catch {
      toast.error("Failed to generate QR");
    }
    setQrLoading(false);
  };

  if (loading) {
     return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center shrink-0">
          <QrCode className="w-6 h-6 text-brand" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
            Attendance QR Generator
          </h2>
          <p className="text-sm text-muted-foreground">
            Generate a time-limited QR code to mark student attendance for active drives.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 md:p-10">
        {/* Decorative gradient stripe */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand via-purple-500 to-pink-500" />
        
        <div className="max-w-xl mx-auto space-y-8">
          
          <div className="bg-muted/40 p-6 md:p-8 rounded-[1.5rem] border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="space-y-5">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand" />
                Select Placement Drive
              </label>
              <div className="relative">
                <select
                  value={selectedDrive}
                  onChange={(e) => {
                    setSelectedDrive(e.target.value);
                    setQrImageUrl(""); // Clear QR when changing drive
                  }}
                  className="w-full pl-5 pr-12 py-4 rounded-xl border border-border bg-background text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all shadow-sm appearance-none cursor-pointer hover:border-brand/50"
                >
                  <option value="">— Choose an active drive —</option>
                  {drives.map((drive) => (
                    <option key={drive.id} value={drive.id}>
                      {drive.companyName} • {new Date(drive.driveDate).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>

              <button
                onClick={generateQr}
                disabled={!selectedDrive || qrLoading}
                className="w-full py-4 bg-gradient-to-r from-brand to-brand/90 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {qrLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <QrCode className="w-5 h-5" />
                )}
                Generate Attendance QR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQrModal && qrImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}>
          <div className="bg-card border border-border rounded-[2rem] p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}>
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest mb-3">
              Ready to Scan
            </div>
            
            <h2 className="text-2xl font-black text-foreground mb-1 tracking-tight">Attendance QR</h2>
            <p className="text-sm text-muted-foreground mb-6 font-medium">For <span className="text-foreground font-bold">{qrDriveName}</span></p>
            
            <div className="relative p-5 bg-white rounded-[1.5rem] shadow-xl border border-border/50 inline-block group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={qrImageUrl} alt="Attendance QR Code" className="w-56 h-56 relative z-10 mx-auto" />
            </div>
            
            {timeLeft === "Expired" ? (
              <div className="mt-6 inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-5 py-2 rounded-full font-bold text-sm border border-red-200 dark:border-red-500/20 shadow-sm">
                <AlertCircle className="w-4 h-4" /> QR Code Expired
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center gap-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Expires In
                </p>
                <div className="font-mono text-2xl font-black text-brand tracking-tight drop-shadow-sm">
                  {timeLeft}
                </div>
              </div>
            )}
            
            <div className="flex gap-3 mt-8 justify-center">
              {timeLeft !== "Expired" && (
                <a href={qrImageUrl} download={`${qrDriveName}-attendance-qr.png`}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-brand to-brand/90 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-brand/20 transition-all">
                  Download
                </a>
              )}
              <button onClick={() => setShowQrModal(false)}
                className="flex-1 px-4 py-3 bg-muted text-foreground rounded-xl text-xs font-bold hover:bg-muted/80 transition-colors border border-border/50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
