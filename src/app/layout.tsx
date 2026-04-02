import type { Metadata } from "next";
import { Lexend, Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const lexend = Lexend({
  subsets: ["latin"],
  // Changed this to match your globals.css variable name
  variable: "--font-display", 
});

export const metadata: Metadata = {
  title: "RGI Training & Placement | Radharaman Group of Institutes",
  description: "Empowering the next generation of professional leaders through industry-aligned training and strategic excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* 1. Added suppressHydrationWarning (Required for next-themes) */
    <html lang="en" className={cn("scroll-smooth", "font-sans", geist.variable)} suppressHydrationWarning>
      <body 
        className={`
          ${lexend.variable} 
          antialiased 
          /* 2. Use the CSS variables we defined in globals.css instead of hardcoded hex codes */
          bg-background text-foreground
        `}
      >
        {/* Top Loader */}
        <NextTopLoader
          color="#7c3aed"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #7c3aed,0 0 5px #7c3aed"
        />
        {/* 3. Wrapped with ThemeProvider */}
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
        >
          {children}
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}