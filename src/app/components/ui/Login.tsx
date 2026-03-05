// src/app/components/ui/Login.tsx
"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import LoginContent with a loading fallback
const LoginContent = dynamic(() => import("./LoginContent"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  ),
});

interface LoginProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  redirectPath?: string;
  onSuccess?: () => void;
}

export default function Login(props: LoginProps) {
  return (
    <Suspense fallback={null}>
      <LoginContent {...props} />
    </Suspense>
  );
}
