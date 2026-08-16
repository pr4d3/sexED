import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ChiChan SexEd - Nền tảng Giáo dục Giới tính Trực tuyến",
  description: "Nền tảng e-learning chuẩn y khoa giúp phụ huynh và thanh thiếu niên thấu hiểu giới tính, tâm lý dậy thì và kỹ năng bảo vệ bản thân.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full bg-[#0B0F19] text-[#E2E8F0] font-sans antialiased flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
