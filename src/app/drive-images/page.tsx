"use client";
export const runtime = "edge";

import { useEffect, useState } from "react";

interface DriveImageData {
  id: string;
  title: string;
  imageUrl: string;
  driveId: string;
  createdAt: string;
}

interface DriveWithImages {
  id: string;
  companyName: string;
  driveDate: string;
  driveImages: DriveImageData[];
}

export default function DriveImagesPage() {
  const [drives, setDrives] = useState<DriveWithImages[]>([]);
  const [images, setImages] = useState<DriveImageData[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const res = await fetch("/api/home/driveImages?limit=100");
        const data = (await res.json()) as {
          success: boolean;
          drives: DriveWithImages[];
        };

        if (data.success && data.drives?.length) {
          const sortedDrives = [...data.drives].sort(
            (a, b) =>
              new Date(b.driveDate).getTime() - new Date(a.driveDate).getTime(),
          );
          setDrives(sortedDrives);
          setSelectedDrive(sortedDrives[0].id);
          setImages(sortedDrives[0].driveImages);
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
    if (!selectedDrive) {
      setImages([]);
      return;
    }

    const selectedDriveData = drives.find((drive) => drive.id === selectedDrive);
    setImages(selectedDriveData?.driveImages ?? []);
  }, [drives, selectedDrive]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Loading drive images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 lg:px-20 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Drive Images Gallery</h1>
          <p className="text-muted-foreground text-lg">Moments from our campus recruitment drives</p>
        </div>

        {drives.length > 0 && (
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3">Select Drive</label>
            <select
              value={selectedDrive}
              onChange={(e) => setSelectedDrive(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-base"
            >
              {drives.map((drive) => (
                <option key={drive.id} value={drive.id}>
                  {drive.companyName} • {new Date(drive.driveDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        )}

        {images.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl text-muted-foreground">No images available for this drive</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group rounded-lg overflow-hidden bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300"
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
                  <p className="text-sm text-muted-foreground">
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
