// src/app/tutor/sessions/page.tsx
import { Suspense } from "react";
import TutorSessionsContent from "./TutorSessionsContent";

// Force the page to be dynamically rendered
export const dynamic = "force-dynamic";

export default function TutorSessionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
        </div>
      }
    >
      <TutorSessionsContent />
    </Suspense>
  );
}
