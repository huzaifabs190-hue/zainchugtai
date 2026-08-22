import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dumont-insurance-ct.levelupsols.chatgpt.site"),
  title: "Insurance & Financial Realty LLC | Bristol, CT",
  description: "All forms of insurance, surety bonds, corporate filing, payroll services, and real estate guidance in Bristol, Connecticut.",
  openGraph: {
    title: "Insurance & Financial Realty LLC",
    description: "All forms of insurance. One trusted place.",
    images: [{ url: "/og.png", width: 1664, height: 944, alt: "Insurance & Financial Realty LLC" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
