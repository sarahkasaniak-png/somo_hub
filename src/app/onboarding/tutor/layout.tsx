// src/app/onboarding/tutor/layout.tsx
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function TutorOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    //   <head>
    //     <Script
    //       src="https://js.paystack.co/v1/inline.js"
    //       strategy="beforeInteractive"
    //     />
    //   </head>
    //   <body className={inter.className}>
    //     <main className="min-h-screen bg-gray-50 py-8">
    //       <div className="container mx-auto px-4 w-full">{children}</div>
    //     </main>
    //     <Toaster position="top-right" />
    //   </body>
    // </html>
    <div className="min-h-screen bg-white">{children}</div>
  );
}
