import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cork & Compass — a little wine wisdom",
  description: "A friendly five-minute wine learning journey for restaurant servers.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
