// src/app/onboarding/tutor/status/page.tsx (Server Component)
import { Suspense } from "react";
import StatusContent from "./StatusContent";

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <StatusContent />
    </Suspense>
  );
}
