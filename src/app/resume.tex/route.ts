import { buildResumeTex } from "@/lib/resumeTex";
import { RESUME_FILENAME } from "@/lib/resumeContent";

export const dynamic = "force-static";

/** Downloadable LaTeX source of the résumé — upload to Overleaf or compile with pdfLaTeX. */
export function GET() {
  return new Response(buildResumeTex(), {
    headers: {
      "Content-Type": "application/x-tex; charset=utf-8",
      "Content-Disposition": `attachment; filename="${RESUME_FILENAME}.tex"`,
    },
  });
}
