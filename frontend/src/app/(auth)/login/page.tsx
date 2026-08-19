'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
    const { login, loading } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
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
                router.push('/');
            }
        } catch (err: any) {
            const errMsg = err.message || 'Sai thông tin đăng nhập';
            setError(errMsg);
            showToast(errMsg, 'error');
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
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="username">
                        Tên đăng nhập hoặc Email
                    </label>
                    <input
                        id="username"
                        type="text"
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-shadow text-sm text-on-surface placeholder:text-outline backdrop-blur-sm shadow-inner"
                        placeholder="username hoặc email"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="password">
                        Mật khẩu
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-shadow text-sm text-on-surface placeholder:text-outline backdrop-blur-sm shadow-inner"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between mt-2 px-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 bg-white/50"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span className="text-xs text-on-surface-variant font-medium">Ghi nhớ đăng nhập</span>
                    </label>
                    <a className="text-xs font-semibold text-primary hover:underline hover:text-primary-container transition-colors" href="#">
                        Quên mật khẩu?
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-bold text-xs transition-all duration-300 hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-md hover:shadow-lg"
                >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>
        </>
    );
}
