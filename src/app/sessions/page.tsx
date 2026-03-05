// src/app/sessions/page.tsx
import { Suspense } from "react";
import SessionsContent from "./SessionsContent";
import { Loader2 } from "lucide-react"; // Or any loading indicator

export default function SessionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-main" />
        </div>
      }
    >
      <SessionsContent />
    </Suspense>
  );
}
