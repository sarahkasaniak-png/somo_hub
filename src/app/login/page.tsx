// app/login/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Login from "@/app/components/ui/Login";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(true);

  // If user becomes authenticated, redirect to returnUrl
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
