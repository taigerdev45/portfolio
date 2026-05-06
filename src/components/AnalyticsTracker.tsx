"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackVisit, trackPageView } from "@/lib/services";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Premier chargement de la session
    trackVisit().catch(console.error);
  }, []);

  useEffect(() => {
    // Chargement de chaque page
    if (pathname) {
      trackPageView().catch(console.error);
    }
  }, [pathname]);

  return null;
}
