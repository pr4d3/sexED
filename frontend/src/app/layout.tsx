import type { Metadata } from "next";
import { Inter, Mea_Culpa, WindSong } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

const meaCulpa = Mea_Culpa({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-mea-culpa",
});

const windSong = WindSong({
  weight: ["400", "500"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-windsong",
});

export const metadata: Metadata = {
  title: "ChiChan - Nền tảng Giáo dục Giới tính Trực tuyến",
  description:
    "Nền tảng e-learning chuẩn y khoa giúp phụ huynh và thanh thiếu niên thấu hiểu giới tính, tâm lý dậy thì và kỹ năng bảo vệ bản thân.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${meaCulpa.variable} ${windSong.variable} h-full`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="min-h-full bg-background text-on-background font-sans antialiased flex flex-col">
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
