import type { Metadata } from "next";
import "./globals.css";
import AnalyticsConsent from "./AnalyticsConsent";

const siteUrl = "https://ifrllc.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Insurance & Financial Realty LLC | Bristol, CT",
    template: "%s | Insurance & Financial Realty LLC",
  },
  description: "All forms of insurance, surety bonds, corporate filing, payroll services, and real estate guidance in Bristol, Connecticut.",
  applicationName: "Insurance & Financial Realty LLC",
  keywords: ["insurance Bristol CT", "auto insurance Bristol", "business insurance Connecticut", "contractor insurance", "surety bonds", "corporate filing", "payroll services", "Bristol real estate"],
  authors: [{ name: "Insurance & Financial Realty LLC" }],
  creator: "Insurance & Financial Realty LLC",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Insurance & Financial Realty LLC",
    title: "Insurance & Financial Realty LLC",
    description: "Insurance, business services, and real estate guidance from a local licensed broker in Bristol, Connecticut.",
    images: [{ url: "/og.png", width: 1664, height: 944, alt: "Insurance & Financial Realty LLC" }],
  },
  twitter: { card: "summary_large_image", title: "Insurance & Financial Realty LLC", description: "Local insurance, business services, and real estate guidance in Bristol, CT.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["InsuranceAgency", "LocalBusiness"],
    name: "Insurance & Financial Realty LLC",
    url: siteUrl,
    telephone: "+1-718-844-1340",
    email: "insurancefinancialrealty@gmail.com",
    image: `${siteUrl}/og.png`,
    address: { "@type": "PostalAddress", streetAddress: "1019 Farmington Avenue, Suite 5", addressLocality: "Bristol", addressRegion: "CT", postalCode: "06010", addressCountry: "US" },
    areaServed: { "@type": "City", name: "Bristol, Connecticut" },
  };

  return <html lang="en"><body>{children}<AnalyticsConsent/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/></body></html>;
}
