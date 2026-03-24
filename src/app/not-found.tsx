import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
      <h1 className="text-7xl font-black text-brand mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-brand text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-brand/90 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
