import React, { useState } from "react";
import { Camera, Loader2, Upload, Trash2 } from "lucide-react";
import { getToken } from "@/lib/auth-client";
import { uploadFileToR2 } from "@/lib/upload-r2";
import { toast } from "sonner";

interface MemoriesTabProps {
  memories: any[];
  fetchDashboard: () => void;
}

export default function MemoriesTab({ memories, fetchDashboard }: MemoriesTabProps) {
  const [memUploading, setMemUploading] = useState(false);
  const [isMemModalOpen, setIsMemModalOpen] = useState(false);
  const [selectedMemFiles, setSelectedMemFiles] = useState<File[]>([]);
  const [memBatchTitle, setMemBatchTitle] = useState("");
  const [memPreviews, setMemPreviews] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleMemoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const oversized = files.some((f) => f.size > 10 * 1024 * 1024);
    if (oversized) {
      toast.error("One or more images are larger than 10MB");
      return;
    }

    setSelectedMemFiles(files);
    setMemBatchTitle("");

    const previewPromises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const results = await Promise.all(previewPromises);
    setMemPreviews(results);
    setIsMemModalOpen(true);
  };

  const startMemoryUpload = async () => {
    if (selectedMemFiles.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    try {
      setMemUploading(true);

      const uploadPromises = selectedMemFiles.map((file) =>
        uploadFileToR2(file, "memories", { role: "student" })
      );
      const imageUrls = await Promise.all(uploadPromises);

      const uploadedMemories = imageUrls.map((url) => ({
        imageUrl: url,
        title: memBatchTitle || "Untitled Memory",
      }));

      const token = getToken("student");
      const res = await fetch("/api/student/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memories: uploadedMemories }),
      });

      const d = (await res.json()) as any;
      if (d.success) {
        toast.success(d.message || "Memories uploaded! They will appear after moderation.");
        setIsMemModalOpen(false);
        setSelectedMemFiles([]);
        setMemPreviews([]);
        setMemBatchTitle("");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed: " + err.message);
    } finally {
      setMemUploading(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      setDeleteLoading(id);
      const token = getToken("student");
      const res = await fetch("/api/student/memories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const d = (await res.json()) as any;
      if (d.success) {
        toast.success("Memory deleted successfully!");
        fetchDashboard();
      } else {
        throw new Error(d.message);
      }
    } catch (error: any) {
      console.error("Error deleting memory:", error);
      toast.error("Failed to delete memory. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
      {isMemModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-lg p-6 shadow-2xl border border-border space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-foreground tracking-tight">Create Memory</h3>
              <p className="text-sm text-muted-foreground">Share this special moment from your journey</p>
            </div>

            {memPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 max-h-75 overflow-y-auto p-1 scrollbar-hide">
                {memPreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-brand/20 bg-muted group">
                    <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Batch Title (Optional)</label>
                <input
                  type="text"
                  value={memBatchTitle}
                  onChange={(e) => setMemBatchTitle(e.target.value)}
                  placeholder="e.g. Campus Farewell..."
                  className="w-full bg-muted px-6 py-4 rounded-lg border-none focus:ring-2 focus:ring-brand outline-none text-foreground font-medium transition-all"
                />
                <p className="text-xs text-muted-foreground ml-1">This title will be applied to all {selectedMemFiles.length} images.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setIsMemModalOpen(false); setSelectedMemFiles([]); setMemPreviews([]); }}
                  className="flex-1 bg-muted text-foreground px-6 py-4 rounded-lg font-bold hover:bg-muted/80 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={startMemoryUpload}
                  disabled={memUploading}
                  className="flex-2 bg-brand text-white px-6 py-4 rounded-lg font-bold hover:bg-brand/90 transition-all text-sm disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-[var(--shadow-brand)]"
                >
                  {memUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading {selectedMemFiles.length} Photos...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload All
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand" />
            My Memories
          </h2>
          <label className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-lg text-xs font-bold hover:bg-brand/20 transition-all cursor-pointer">
            {memUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {memUploading ? "Uploading..." : "Upload Memory"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleMemoryUpload} disabled={memUploading} />
          </label>
        </div>
        {memories.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No memories uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {memories.map((m: any) => (
              <div key={m.id} className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center object-top">
                  <img src={m.imageUrl} alt="Memory" loading="lazy" className="w-full h-full object-cover" />
                </div>

                <div className="p-3 flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    m.status === "approved" ? "bg-green-500/10 text-green-600"
                    : m.status === "rejected" ? "bg-red-500/10 text-red-500"
                    : "bg-yellow-500/10 text-yellow-600"
                  }`}>{m.status === "pending_moderation" ? "Pending" : m.status}</span>
                  {deleteLoading === m.id ? (
                    <div className="size-5 border-3 border-red-500 rounded-full border-t-transparent animate-spin"></div>
                  ) : (
                    <Trash2 className="text-red-500 cursor-pointer size-6" onClick={() => handleDeleteMemory(m.id)} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
