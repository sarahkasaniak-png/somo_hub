// app/login/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Login from "@/app/components/ui/Login";
import { useAuth } from "@/app/context/AuthContext";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(true);

  useEffect(() => {
    if (user) {
      router.push(returnUrl);
    }
  }, [user, router, returnUrl]);

  const handleClose = () => {
    setIsLoginOpen(false);
    router.push("/");
  };

  return (
    <Login
      isLoginOpen={isLoginOpen}
      setIsLoginOpen={handleClose}
      redirectPath={returnUrl}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="h-screen animate-pulse bg-gray-100"></div>}
    >
      <LoginPageContent />
    </Suspense>
  );
}
