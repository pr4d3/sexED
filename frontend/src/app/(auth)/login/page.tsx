"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await login({
        username_or_email: usernameOrEmail,
        password,
      });

      if (res.success) {
        showToast("Đăng nhập thành công!", "success");
        router.push("/");
      }
    } catch (err: any) {
      const errMsg = err.message || "Sai thông tin đăng nhập";
      setError(errMsg);
      showToast(errMsg, "error");
    }
  };

  return (
    <>
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200/50 p-4 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Username/Email Input Container */}
        <div className="relative">
          <input
            id="username"
            type="text"
            required
            placeholder=" "
            className="peer block w-full px-5 pt-[22px] pb-[10px] rounded-2xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all text-sm text-on-surface placeholder:text-transparent backdrop-blur-sm shadow-inner"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
          <label
            htmlFor="username"
            className="absolute left-5 top-[16px] text-sm transition-all duration-300 transform origin-[0] pointer-events-none peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.8] peer-focus:-translate-y-[10px] scale-[0.8] -translate-y-[10px] text-on-surface-variant/70 peer-focus:text-primary font-medium"
          >
            Tên đăng nhập hoặc Email
          </label>
        </div>

        {/* Password Input Container */}
        <div className="relative">
          <input
            id="password"
            type="password"
            required
            placeholder=" "
            className="peer block w-full px-5 pt-[22px] pb-[10px] rounded-2xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all text-sm text-on-surface placeholder:text-transparent backdrop-blur-sm shadow-inner"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="password"
            className="absolute left-5 top-[16px] text-sm transition-all duration-300 transform origin-[0] pointer-events-none peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.8] peer-focus:-translate-y-[10px] scale-[0.8] -translate-y-[10px] text-on-surface-variant/70 peer-focus:text-primary font-medium"
          >
            Mật khẩu
          </label>
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 bg-white/50"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="text-xs text-on-surface-variant font-medium">
              Ghi nhớ đăng nhập
            </span>
          </label>
          <a
            className="text-xs font-semibold text-primary hover:underline hover:text-primary-container transition-colors"
            href="#"
          >
            Quên mật khẩu?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-bold text-xs transition-all duration-300 hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-md hover:shadow-lg"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </>
  );
}
