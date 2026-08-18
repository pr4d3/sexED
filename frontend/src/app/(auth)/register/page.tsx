'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
    const { register, loading } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();

    const [role, setRole] = useState<'STUDENT_PARENT' | 'STUDENT_CHILD'>('STUDENT_PARENT');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const res = await register({
                username,
                email,
                password,
                full_name: fullName,
                role_code: role,
            });

            if (res.success) {
                setSuccess(true);
                showToast("Đăng ký tài khoản thành công!", "success");
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            }
        } catch (err: any) {
            const errMsg = err.message || 'Lỗi đăng ký tài khoản';
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

            {success && (
                <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 text-xs font-semibold text-primary">
                    Đăng ký tài khoản thành công! Đang chuyển hướng sang Đăng nhập...
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Role Selector */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface ml-1">
                        Bạn tham gia với tư cách nào?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => setRole('STUDENT_PARENT')}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border cursor-pointer backdrop-blur-sm transition-all select-none ${
                                role === 'STUDENT_PARENT' 
                                    ? 'border-primary bg-primary-fixed/30 shadow-sm' 
                                    : 'border-white/60 bg-white/40 hover:bg-white/60'
                            }`}
                        >
                            <span className="material-symbols-outlined text-primary mb-2 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>family_home</span>
                            <span className="text-xs font-bold text-on-surface">Phụ huynh</span>
                        </div>
                        <div
                            onClick={() => setRole('STUDENT_CHILD')}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border cursor-pointer backdrop-blur-sm transition-all select-none ${
                                role === 'STUDENT_CHILD' 
                                    ? 'border-primary bg-primary-fixed/30 shadow-sm' 
                                    : 'border-white/60 bg-white/40 hover:bg-white/60'
                            }`}
                        >
                            <span className="material-symbols-outlined text-primary mb-2 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>backpack</span>
                            <span className="text-xs font-bold text-on-surface">Học sinh</span>
                        </div>
                    </div>
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="fullName">
                        Họ và tên
                    </label>
                    <input
                        id="fullName"
                        type="text"
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-shadow text-sm text-on-surface placeholder:text-outline backdrop-blur-sm shadow-inner"
                        placeholder="Nguyễn Văn An"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="username">
                        Tên đăng nhập
                    </label>
                    <input
                        id="username"
                        type="text"
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-shadow text-sm text-on-surface placeholder:text-outline backdrop-blur-sm shadow-inner"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="email">
                        Địa chỉ Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-shadow text-sm text-on-surface placeholder:text-outline backdrop-blur-sm shadow-inner"
                        placeholder="an.nguyen@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        minLength={6}
                        className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-shadow text-sm text-on-surface placeholder:text-outline backdrop-blur-sm shadow-inner"
                        placeholder="•••••••• (Tối thiểu 6 ký tự)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-bold text-xs transition-all duration-300 hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-md hover:shadow-lg"
                >
                    {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                </button>
            </form>
        </>
    );
}
