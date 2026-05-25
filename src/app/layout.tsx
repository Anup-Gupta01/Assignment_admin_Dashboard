import type { Metadata } from "next";
import MuiProvider from "@/components/MuiProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin dashboard built with Next.js, MUI, and Zustand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  );
}
