"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldWarning, ArrowLeft } from "@phosphor-icons/react";

function InvalidContent() {
  const searchParams = useSearchParams();
  const reason =
    searchParams.get("reason") ||
    searchParams.get("message") ||
    "Bạn không có quyền truy cập vào nội dung này.";

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-lg">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-xs">
          <ShieldWarning size={36} weight="duotone" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
            Truy Cập Không Hợp Lệ
          </h1>
          <p className="text-sm text-on-surface-variant font-light leading-relaxed">
            {reason}
          </p>
        </div>

        {/* Single Button to Home */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Quay về trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function InvalidPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <InvalidContent />
    </Suspense>
  );
}
