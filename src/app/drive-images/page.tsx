"use client";
export const runtime = "edge";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DriveImageData {
  id: string;
  title: string;
  imageUrl: string;
  driveId: string;
  createdAt: string;
  drive: {
    companyName: string;
  };
}

interface Drive {
  id: string;
  companyName: string;
  driveDate: string;
}

export default function DriveImagesPage() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [images, setImages] = useState<DriveImageData[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const res = await fetch("/api/admin/drives?limit=1000");
        const data = await res.json() as { success: boolean; drives: Drive[] };
        if (data.success && data.drives && data.drives.length > 0) {
          const sortedDrives = data.drives.sort(
            (a: Drive, b: Drive) => new Date(b.driveDate).getTime() - new Date(a.driveDate).getTime()
          );
          setDrives(sortedDrives);
          setSelectedDrive(sortedDrives[0].id);
        }
      } catch (error) {
        console.error("Error fetching drives:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  useEffect(() => {
    if (!selectedDrive) return;

    const fetchImages = async () => {
      try {
        const res = await fetch(`/api/drive-images/${selectedDrive}`);
        const data = await res.json() as { success: boolean; images: DriveImageData[] };
        if (data.success) {
          setImages(data.images);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [selectedDrive]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading drive images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 lg:px-20 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Drive Images Gallery</h1>
          <p className="text-slate-500 text-lg">Moments from our campus recruitment drives</p>
        </div>

        {/* Drive Selector */}
        {drives.length > 0 && (
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3">Select Drive</label>
            <select
              value={selectedDrive}
              onChange={(e) => setSelectedDrive(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 text-base"
            >
              {drives.map((drive) => (
                <option key={drive.id} value={drive.id}>
                  {drive.companyName} • {new Date(drive.driveDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-gray-600">No images available for this drive</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{image.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
