// src/app/tutor/sessions/create/page.tsx
import { Suspense } from "react";
import CreateSessionContent from "./CreateSessionContent";

export default function CreateSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      }
    >
      <CreateSessionContent />
    </Suspense>
  );
}
