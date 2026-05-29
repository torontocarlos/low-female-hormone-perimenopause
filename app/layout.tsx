import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Am I in perimenopause? — Ajax Harwood Clinic",
  description:
    "A private tool to help you describe what you’re experiencing around the menopause transition and prepare for a focused conversation with your clinician.",
  robots: { index: false, follow: false }, // pilot: not on public directory yet (§14)
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
