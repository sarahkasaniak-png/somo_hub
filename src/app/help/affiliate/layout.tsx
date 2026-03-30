// src/app/help/affiliate/layout.tsx
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import Navbar from "@/components/Header_2";

const inter = Inter({ subsets: ["latin"] });

export default function TuitionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {children}
    </div>
  );
}
