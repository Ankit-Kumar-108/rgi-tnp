import type { Metadata } from "next";
import { Lexend, Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { cn } from "@/lib/utils";

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
        {/* 3. Wrapped with ThemeProvider */}
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}