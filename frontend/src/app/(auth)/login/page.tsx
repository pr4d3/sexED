'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const { login, loading } = useAuth();
    const router = useRouter();
    
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
                const userRole = res.data.user.role;
                if (userRole === 'ADMIN' || userRole === 'INSTRUCTOR') {
                    router.push('/dashboard');
                } else {
                    router.push('/profile');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Sai thông tin đăng nhập');
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white">Đăng Nhập</h2>
                <p className="text-sm text-slate-400">Chào mừng quay trở lại với ChiChan SexEd</p>
            </div>

            {error && (
                <div className="rounded-md bg-red-900/30 border border-red-500/30 p-4 text-sm text-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="username">
                        Tên đăng nhập hoặc Email
                    </label>
                    <input
                        id="username"
                        type="text"
                        required
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="username hoặc email"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="password">
                            Mật khẩu
                        </label>
                    </div>
                    <input
                        id="password"
                        type="password"
                        required
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm text-slate-400 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded border-white/10 bg-white/5 text-primary focus:ring-0 focus:ring-offset-0"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Ghi nhớ đăng nhập</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex h-12 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
                >
                    {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
                </button>
            </form>

            <div className="text-center text-sm text-slate-400">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                    Đăng ký ngay
                </Link>
            </div>
        </div>
    );
}
