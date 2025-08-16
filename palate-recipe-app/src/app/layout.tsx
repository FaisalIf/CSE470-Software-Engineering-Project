import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppChrome from "@/components/AppChrome";
import "./globals.css";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Palate - Cooking Recipe Media Platform",
  description:
    "Discover, share, and create amazing recipes. Build your perfect meal plan with our comprehensive cooking platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Simple session check (cookie-based, no security)
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppChrome sessionPresent={!!session}>{children}</AppChrome>
      </body>
    </html>
  );
}
