'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, Users, BookOpen, LogOut, ArrowLeft } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isLinkActive = (path: string) => {
        return pathname === path;
    };

    return (
        <div className="flex min-h-screen w-full bg-[#0B0F19]">
            {/* Sidebar navigation */}
            <aside className="w-64 border-r border-white/10 bg-[#0E1322] flex flex-col justify-between shrink-0">
                <div className="p-6 space-y-8">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-xl font-bold tracking-tight text-white">
                            ChiChan<span className="text-primary">.</span>
                        </Link>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary uppercase">
                            Admin
                        </span>
                    </div>

                    <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold mb-3 px-3">
                            Mục quản trị
                        </span>
                        
                        <Link
                            href="/dashboard"
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                                isLinkActive('/dashboard') 
                                    ? 'bg-primary text-white' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <BarChart3 className="h-4.5 w-4.5" />
                            Tổng quan số liệu
                        </Link>

                        <Link
                            href="/dashboard/students"
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                                isLinkActive('/dashboard/students') 
                                    ? 'bg-primary text-white' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Users className="h-4.5 w-4.5" />
                            Theo dõi học viên
                        </Link>
                    </div>
                </div>

                {/* Sidebar footer */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white uppercase">
                            {user?.full_name?.charAt(0) || 'G'}
                        </div>
                        <div className="truncate">
                            <strong className="text-white text-xs font-bold block truncate">{user?.full_name}</strong>
                            <span className="text-[10px] text-slate-500 block truncate">{user?.email}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
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
