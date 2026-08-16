'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Users, Check } from 'lucide-react';

export default function RegisterPage() {
    const { register, loading } = useAuth();
    const router = useRouter();

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
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            }
        } catch (err: any) {
            setError(err.message || 'Lỗi đăng ký tài khoản');
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white">Đăng Ký Học Tập</h2>
                <p className="text-sm text-slate-400">Đồng hành cùng giáo dục giới tính chuẩn khoa học</p>
            </div>

            {error && (
                <div className="rounded-md bg-red-900/30 border border-red-500/30 p-4 text-sm text-red-200">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-md bg-green-900/30 border border-green-500/30 p-4 text-sm text-green-200">
                    Đăng ký tài khoản thành công! Đang chuyển hướng sang Đăng nhập...
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Bạn tham gia với tư cách nào?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => setRole('STUDENT_PARENT')}
                            className={`relative flex flex-col p-4 rounded-lg border-2 bg-white/5 cursor-pointer hover:bg-white/10 transition-all select-none ${
                                role === 'STUDENT_PARENT' ? 'border-primary shadow-lg shadow-primary/10' : 'border-white/10'
                            }`}
                        >
                            {role === 'STUDENT_PARENT' && (
                                <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                                    <Check className="h-3.5 w-3.5" />
                                </div>
                            )}
                            <Users className="h-8 w-8 text-primary mb-2" />
                            <h4 className="font-semibold text-sm text-white mb-1">Tôi là Phụ huynh</h4>
                            <p className="text-[11px] text-slate-400 leading-tight">
                                Học kỹ năng đồng hành và trò chuyện giới tính với trẻ.
                            </p>
                        </div>

                        <div
                            onClick={() => setRole('STUDENT_CHILD')}
                            className={`relative flex flex-col p-4 rounded-lg border-2 bg-white/5 cursor-pointer hover:bg-white/10 transition-all select-none ${
                                role === 'STUDENT_CHILD' ? 'border-primary shadow-lg shadow-primary/10' : 'border-white/10'
                            }`}
                        >
                            {role === 'STUDENT_CHILD' && (
                                <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                                    <Check className="h-3.5 w-3.5" />
                                </div>
                            )}
                            <User className="h-8 w-8 text-accent mb-2" />
                            <h4 className="font-semibold text-sm text-white mb-1">Tôi là Học sinh</h4>
                            <p className="text-[11px] text-slate-400 leading-tight">
                                Khám phá thay đổi tuổi dậy thì và tự bảo vệ bản thân.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="fullName">
                        Họ và tên
                    </label>
                    <input
                        id="fullName"
                        type="text"
                        required
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="Nguyễn Văn An"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="username">
                        Tên đăng nhập
                    </label>
                    <input
                        id="username"
                        type="text"
                        required
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="email">
                        Địa chỉ Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="an.nguyen@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="password">
                        Mật khẩu
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        minLength={6}
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="•••••••• (Tối thiểu 6 ký tự)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full flex h-12 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
                >
                    {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký Ngay'}
                </button>
            </form>

            <div className="text-center text-sm text-slate-400">
                Đã có tài khoản?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Đăng nhập ngay
                </Link>
            </div>
        </div>
    );
}
