import type { UploadFolder } from "./upload-r2";

const MAX_DIMENSIONS: Record<string, { width: number; height: number }> = {
  profiles: { width: 800, height: 800 },
  memories: { width: 1600, height: 1200 },
  "drive-images": { width: 1600, height: 1200 },
};
const MIN_SIZE_TO_COMPRESS = 100 * 1024; // 100KB

export async function compressImage(
  file: File,
  folder: UploadFolder
): Promise<File> {
  // only compress images 
  if (!file.type.startsWith("image/")) return file;
  if (file.size < MIN_SIZE_TO_COMPRESS) return file;

  // SVGs can't be compressed
  if (file.type === "image/svg+xml") return file;

  const limits = MAX_DIMENSIONS[folder];
  if (!limits) return file; // no resumes compress

  try {
    //  createImageBitmap is available in all modern browsers & Edge runtime
    const bitmap = await createImageBitmap(file);
    const { width: origW, height: origH } = bitmap;

    // Calculate new dimensions (maintain aspect ratio)
    let newW = origW;
    let newH = origH;
    if (origW > limits.width || origH > limits.height) {
      const ratio = Math.min(limits.width / origW, limits.height / origH);
      newW = Math.round(origW * ratio);
      newH = Math.round(origH * ratio);
    }

    // Draw onto an OffscreenCanvas (works in Web Workers too)
    const canvas = new OffscreenCanvas(newW, newH);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file; 
    }
    ctx.drawImage(bitmap, 0, 0, newW, newH);
    bitmap.close(); // free memory

    //Encode as WebP at 80% quality
    const blob = await canvas.convertToBlob({
      type: "image/webp",
      quality: 0.8,
    });

    // If compression made it BIGGER, use the original
    if (blob.size >= file.size) return file;

    // Create a new File with .webp extension
    const compressedName = file.name.replace(/\.[^.]+$/, ".webp");
    return new File([blob], compressedName, { type: "image/webp" });
  } catch (err) {
    // If anything fails (e.g. corrupt image), just use original
    console.warn("Image compression failed, using original:");
    return file;
  }
}