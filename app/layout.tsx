import type { Metadata } from "next";
import "./globals.css";
import { ClinicHeader } from "@/components/ClinicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "Am I in perimenopause? · Ajax Harwood Clinic",
    template: "%s · Ajax Harwood Clinic",
  },
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
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <ClinicHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
