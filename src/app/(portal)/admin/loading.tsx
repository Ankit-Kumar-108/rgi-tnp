import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
        <p className="text-sm text-muted-foreground font-medium">Loading admin panel...</p>
      </div>
    </div>
  );
}
