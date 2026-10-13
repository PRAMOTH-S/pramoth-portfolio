"use client";

import { useEffect } from "react";

const ID_KEY = "pp_visitor_id";
const SESSION_KEY = "pp_viewed";

/** Silent, UI-less: records one `view` per browser session so the owner can see who visited. */
export function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      let id = localStorage.getItem(ID_KEY);
      if (!id) {
        // randomUUID needs a secure context; phones on http://192.168.x.x don't have one.
        id = typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem(ID_KEY, id);
      }
      fetch("/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          type: "view",
          visitorId: id,
          page: location.pathname,
          referrer: document.referrer || undefined,
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screen: `${screen.width}x${screen.height}`,
        }),
      }).catch(() => {});
    } catch {
      /* storage blocked (private mode) — skip */
    }
  }, []);
  return null;
}
