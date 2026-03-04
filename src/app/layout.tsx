// //src/app/layout.tsx
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "./components/ui/Navbar";
// import { AuthProvider } from "./context/AuthContext";
// import ConditionalNavbar from "@/components/ConditionalNavbar";
// import { Toaster } from "react-hot-toast";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "SomoHub - Find Tutors & Learning Communities",
//   description:
//     "Platform for finding tutors, tuition, joining educational communities, and accessing learning sessions",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <AuthProvider>
//           <ConditionalNavbar />
//           {/* <Navbar /> */}
//           {children}
//           <Toaster
//             position="top-center"
//             toastOptions={{
//               duration: 5000,
//               style: {
//                 background: "#363636",
//                 color: "#fff",
//               },
//               success: {
//                 duration: 5000,
//                 iconTheme: {
//                   primary: "#10b981",
//                   secondary: "white",
//                 },
//               },
//               error: {
//                 duration: 5000,
//                 iconTheme: {
//                   primary: "#ef4444",
//                   secondary: "white",
//                 },
//               },
//             }}
//           />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import { Toaster } from "react-hot-toast";
import Footer from "./components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SomoHub - Find Tutors & Learning Communities",
  description:
    "Platform for finding tutors, tuition, joining educational communities, and accessing learning sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ConditionalNavbar />
          <FavoritesProvider>{children}</FavoritesProvider>
          <ConditionalFooter />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 5000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "white",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "white",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
