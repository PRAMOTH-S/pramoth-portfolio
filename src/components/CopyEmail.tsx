"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

/** One-click copy of the email address, with a live-region confirmation. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked (http on LAN, permissions): fall back to the mail client.
      location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={`mailto:${email}`} className="btn-primary !px-4 !py-2.5 !text-sm">
        Say hello
      </a>
      <button
        type="button"
        onClick={copy}
        className={`btn-ghost !px-3.5 !py-2.5 !text-sm ${copied ? "!border-accent !text-accent" : ""}`}
        aria-label={copied ? "Email address copied" : `Copy ${email}`}
      >
        {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
        <span className="font-mono text-xs">{copied ? "Copied" : email}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
