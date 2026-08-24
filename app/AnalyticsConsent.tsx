"use client";

import { useEffect, useState } from "react";

const analyticsId = process.env.NEXT_PUBLIC_GA_ID;

function enableAnalytics() {
  if (!analyticsId || document.querySelector(`script[data-ga="${analyticsId}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
  script.dataset.ga = analyticsId;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) { window.dataLayer?.push(args); };
  window.gtag("js", new Date());
  window.gtag("config", analyticsId, { anonymize_ip: true });
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState<"accepted"|"declined"|null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ifr-cookie-consent") as "accepted"|"declined"|null;
    setChoice(saved);
    if (saved === "accepted") enableAnalytics();
  }, []);

  if (choice || !analyticsId) return null;

  const decide = (value: "accepted"|"declined") => {
    localStorage.setItem("ifr-cookie-consent", value);
    setChoice(value);
    if (value === "accepted") enableAnalytics();
  };

  return <aside className="cookie-banner" aria-label="Analytics preferences">
    <div><strong>Your privacy matters</strong><p>We use optional analytics to understand website traffic. No advertising cookies are used.</p></div>
    <div><button className="cookie-secondary" onClick={() => decide("declined")}>Decline</button><button className="cookie-primary" onClick={() => decide("accepted")}>Allow analytics</button></div>
  </aside>;
}
