"use client";

import { Printer } from "lucide-react";

/** Opens the browser print dialog — "Save as PDF" produces the downloadable résumé. */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-primary !px-4 !py-2 !text-sm">
      <Printer size={15} aria-hidden /> Download PDF
    </button>
  );
}
