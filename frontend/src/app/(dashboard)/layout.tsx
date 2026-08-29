'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isLinkActive = (path: string) => {
        return pathname === path;
    };

    return (
        <div className="flex min-h-screen w-full bg-background text-on-background antialiased font-sans">
            {/* Sidebar navigation */}
            <aside className="w-64 border-r border-outline-variant/30 bg-white/80 backdrop-blur-md flex flex-col justify-between shrink-0 h-screen sticky top-0">
                <div className="p-6 space-y-8">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-lg font-extrabold text-primary">
                            EduSex VN
                        </Link>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant uppercase">
                            Admin
                        </span>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold mb-3 px-3">
                            Mục quản trị
                        </span>
                        
                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                                isLinkActive('/dashboard') 
                                    ? 'bg-primary text-white shadow-sm' 
                                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/50'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">analytics</span>
                            Tổng quan số liệu
                        </Link>

                        <Link
                            href="/dashboard/students"
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                                isLinkActive('/dashboard/students') 
                                    ? 'bg-primary text-white shadow-sm' 
                                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/50'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">group</span>
                            Theo dõi học viên
                        </Link>

                        <Link
                            href="/game"
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                                isLinkActive('/game') 
                                    ? 'bg-primary text-white shadow-sm' 
                                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/50'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                            Phòng Chơi AI Roleplay
                        </Link>
                    </div>
                </div>

                {/* Sidebar footer */}
                <div className="p-4 border-t border-outline-variant/20 space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 border border-white/80 shadow-sm">
                        <div className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold uppercase">
                            {user?.full_name?.charAt(0) || 'G'}
                        </div>
                        <div className="truncate">
                            <strong className="text-on-surface text-xs font-bold block truncate">{user?.full_name}</strong>
                            <span className="text-[10px] text-on-surface-variant block truncate">{user?.email}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-white/50 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Về trang chủ
                    </button>
                </div>
            </aside>

            {/* Main content page area */}
            <main className="flex-grow p-8 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
