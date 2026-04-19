"use client";
export const runtime = "edge";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { uploadFileToR2 } from "@/lib/upload-r2";
import {
  Upload,
  X,
  ImagePlus,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Images,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getToken } from "@/lib/auth-client";

/*Types*/

interface DriveImage {
  id: string;
  title: string;
  imageUrl: string;
  driveId: string;
  uploadedBy: string;
  createdAt: string;
  drive: {
    id: string;
    companyName: string;
    driveDate: string;
  };
}

interface Drive {
  id: string;
  companyName: string;
  driveDate: string;
}

/** Represents one of the 4 upload slots */
interface ImageSlot {
  file: File | null;
  preview: string | null;
}

const EMPTY_SLOTS: ImageSlot[] = Array.from({ length: 4 }, () => ({
  file: null,
  preview: null,
}));

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

export default function VolunteerDriveImageManagement() {
  // ── State ──
  const [images, setImages] = useState<DriveImage[]>([]);
  const [drives, setDrives] = useState<Drive[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string>("");
  const [filterDrive, setFilterDrive] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [slots, setSlots] = useState<ImageSlot[]>([...EMPTY_SLOTS]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [existingCount, setExistingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Fetch drives ──
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
          const sorted = [...data.drives].sort(
            (a, b) =>
              new Date(b.driveDate).getTime() - new Date(a.driveDate).getTime(),
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

  // ── Fetch images ──
  const fetchImages = useCallback(async () => {
    try {
      const token = getToken("student");
      let url = `/api/volunteer/drive-images?page=${page}&limit=20`;
      if (filterDrive) url += `&driveId=${filterDrive}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as {
        success: boolean;
        images: DriveImage[];
        pagination: { totalPages: number };
      };
      if (data.success) {
        setImages(data.images);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }, [filterDrive, page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // ── Check existing image count for selected drive ──
  useEffect(() => {
    if (!selectedDrive) {
      setExistingCount(0);
      return;
    }
    const check = async () => {
      try {
        const token = getToken("student");
        const res = await fetch(
          `/api/volunteer/drive-images?driveId=${selectedDrive}&limit=100`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = (await res.json()) as {
          success: boolean;
          images: DriveImage[];
        };
        setExistingCount(data.success ? data.images.length : 0);
      } catch {
        setExistingCount(0);
      }
    };
    check();
  }, [selectedDrive]);

  // ── Slot handlers ──
  const handleSlotFile = (index: number, file: File | null) => {
    setSlots((prev) => {
      const next = [...prev];
      // Revoke old preview URL to prevent memory leak
      if (next[index].preview) URL.revokeObjectURL(next[index].preview!);
      next[index] = {
        file,
        preview: file ? URL.createObjectURL(file) : null,
      };
      return next;
    });
  };

  const handleSlotDrop = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleSlotFile(index, file);
    }
  };

  const clearSlot = (index: number) => {
    handleSlotFile(index, null);
    // Reset file input
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }
  };

  const clearAllSlots = () => {
    slots.forEach((_, i) => clearSlot(i));
  };

  // ── Upload ──
  const filledSlots = slots.filter((s) => s.file !== null);
  const remainingCapacity = 4 - existingCount;
  const canUpload =
    filledSlots.length > 0 &&
    filledSlots.length <= remainingCapacity &&
    selectedDrive &&
    title.trim().length > 0;

  const handleUpload = async () => {
    if (!canUpload) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const filesToUpload = slots
        .map((s) => s.file)
        .filter((f): f is File => f !== null);

      // Upload all files to R2 in parallel
      const uploadPromises = filesToUpload.map((file, idx) =>
        uploadFileToR2(file, "drive-images" as any).then((url) => {
          setUploadProgress(
            Math.round(((idx + 1) / filesToUpload.length) * 80),
          );
          return url;
        }),
      );

      const imageUrls = await Promise.all(uploadPromises);
      setUploadProgress(85);

      // Save to database (batch)
      const token = getToken("student");
      const res = await fetch("/api/volunteer/drive-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          images: imageUrls.map((url) => ({ imageUrl: url })),
          driveId: selectedDrive,
        }),
      });

      const data = (await res.json()) as { success: boolean; message?: string };
      setUploadProgress(100);

      if (data.success) {
        toast.success(
          `${filesToUpload.length} image${filesToUpload.length > 1 ? "s" : ""} uploaded successfully!`,
        );
        setTitle("");
        clearAllSlots();
        // Refetch to show new images
        setFilterDrive(selectedDrive);
        setPage(1);
        fetchImages();
      } else {
        toast.error(data.message || "Failed to save images");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // ── Delete ──
  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setDeleting(imageId);
    try {
      const token = getToken("student");
      const res = await fetch(`/api/volunteer/drive-images/${imageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { success: boolean };
      if (data.success) {
        toast.success("Image deleted");
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  // ── Group images by drive for display ──
  const groupedByDrive = images.reduce(
    (acc, img) => {
      const key = img.driveId;
      if (!acc[key]) {
        acc[key] = {
          drive: img.drive,
          title: img.title,
          images: [],
        };
      }
      acc[key].images.push(img);
      return acc;
    },
    {} as Record<
      string,
      { drive: DriveImage["drive"]; title: string; images: DriveImage[] }
    >,
  );

  /* ──────────────────────────────────────────────
     Render
     ────────────────────────────────────────────── */
  return (
    <div className="space-y-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
          <Images className="w-6 h-6 text-brand" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Drive Image Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload up to 4 images per placement drive for the homepage marquee
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Upload Card
          ═══════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl border border-brand/10 bg-card shadow-xl">
        {/* Decorative gradient stripe */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-purple-500 to-pink-500" />

        <div className="p-6 md:p-8 space-y-6">
          {/* Section title */}
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-brand" />
            <h3 className="text-lg font-bold text-foreground">
              Upload Drive Images
            </h3>
          </div>

          {/* Drive selector + Title row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Drive selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Drive
              </label>
              <select
                id="drive-selector"
                value={selectedDrive}
                onChange={(e) => setSelectedDrive(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all"
              >
                <option value="">— Choose a placement drive —</option>
                {drives.map((drive) => (
                  <option key={drive.id} value={drive.id}>
                    {drive.companyName} •{" "}
                    {new Date(drive.driveDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {selectedDrive && existingCount > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  This drive already has {existingCount}/4 images.{" "}
                  {remainingCapacity > 0
                    ? `You can add ${remainingCapacity} more.`
                    : "Delete existing images first."}
                </p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Image Title
              </label>
              <input
                id="image-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Successful Campus Drive of Google"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all"
              />
            </div>
          </div>

          {/* 4 Image Slots */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
              Upload Images ({filledSlots.length}/4)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {slots.map((slot, index) => (
                <div key={index} className="relative group">
                  {slot.preview ? (
                    /* ── Filled slot ── */
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-brand/30 shadow-md">
                      <img
                        src={slot.preview}
                        alt={`Slot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => clearSlot(index)}
                          className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {/* Index badge */}
                      <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shadow">
                        {index + 1}
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400 drop-shadow" />
                      </div>
                    </div>
                  ) : (
                    /* ── Empty slot (drop zone) ── */
                    <label
                      htmlFor={`slot-input-${index}`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleSlotDrop(index, e)}
                      className="aspect-[4/3] rounded-2xl border-2 border-dashed border-border hover:border-brand/50 bg-muted/30 hover:bg-brand/5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group/slot"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center group-hover/slot:bg-brand/20 transition-colors">
                        <ImagePlus className="w-5 h-5 text-brand" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Image {index + 1}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60">
                        Drag or click
                      </span>
                      <input
                        id={`slot-input-${index}`}
                        ref={(el) => {
                          fileInputRefs.current[index] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleSlotFile(index, e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Uploading images…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand to-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id="upload-images-btn"
              onClick={handleUpload}
              disabled={!canUpload || uploading}
              className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-brand to-brand/80 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload {filledSlots.length} Image
                  {filledSlots.length !== 1 ? "s" : ""}
                </>
              )}
            </button>

            {filledSlots.length > 0 && !uploading && (
              <button
                type="button"
                onClick={clearAllSlots}
                className="px-4 py-3 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          Uploaded Images (grouped by drive)
          ═══════════════════════════════════════════ */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">
            Uploaded Images
          </h3>
          {/* Filter */}
          <select
            id="filter-drive"
            value={filterDrive}
            onChange={(e) => {
              setFilterDrive(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/40 transition-all"
          >
            <option value="">All Drives</option>
            {drives.map((drive) => (
              <option key={drive.id} value={drive.id}>
                {drive.companyName}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-16 flex flex-col items-center justify-center gap-3">
            <Images className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm font-medium">
              No images found
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDrive).map(
              ([driveId, { drive, title: groupTitle, images: groupImages }]) => (
                <div
                  key={driveId}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Drive header */}
                  <div className="px-6 py-4 bg-muted/30 border-b border-border flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground text-sm">
                        {drive.companyName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {groupTitle} •{" "}
                        {new Date(drive.driveDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand bg-brand/10 px-3 py-1 rounded-full">
                      {groupImages.length}/4 images
                    </span>
                  </div>

                  {/* Image grid */}
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {groupImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-muted"
                      >
                        <img
                          src={image.imageUrl}
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Delete overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handleDelete(image.id)}
                            disabled={deleting === image.id}
                            className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 disabled:opacity-50 transition-colors shadow-lg cursor-pointer"
                            aria-label={`Delete image`}
                          >
                            {deleting === image.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm font-medium text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
