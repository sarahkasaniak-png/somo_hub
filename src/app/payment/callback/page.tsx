// src/app/payment/callback/page.tsx
import { Suspense } from "react";
import PaymentVerifier from "./PaymentVerifier";

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg text-center">
            <div className="animate-pulse space-y-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      }
    >
      <PaymentVerifier />
    </Suspense>
  );
}
