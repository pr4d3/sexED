'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const isLinkActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <header className="glass-panel sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <Link href="/" className="text-2xl font-bold tracking-tight text-white">
                    ChiChan<span className="text-primary">.</span>
                </Link>
                
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/" className={`text-sm font-medium transition-colors hover:text-white ${isLinkActive('/') ? 'text-white font-semibold' : 'text-slate-400'}`}>
                        Trang Chủ
                    </Link>
                    <Link href="/courses" className={`text-sm font-medium transition-colors hover:text-white ${isLinkActive('/courses') ? 'text-white font-semibold' : 'text-slate-400'}`}>
                        Khóa Học
                    </Link>
                    <Link href="/forum" className={`text-sm font-medium transition-colors hover:text-white ${isLinkActive('/forum') ? 'text-white font-semibold' : 'text-slate-400'}`}>
                        Diễn Đàn
                    </Link>
                    <Link href="/about" className={`text-sm font-medium transition-colors hover:text-white ${isLinkActive('/about') ? 'text-white font-semibold' : 'text-slate-400'}`}>
                        Giới Thiệu
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link href="/profile" className="text-sm text-slate-300 hover:text-white font-medium">
                                Chào, <span className="underline decoration-primary decoration-2">{user.full_name}</span>
                            </Link>
                            {(user.role === 'ADMIN' || user.role === 'INSTRUCTOR') && (
                                <Link href="/dashboard" className="hidden sm:inline-flex h-9 items-center justify-center rounded-md border border-white/10 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/5">
                                    Dashboard
                                </Link>
                            )}
                            <button onClick={logout} className="h-9 items-center justify-center rounded-md border border-white/10 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/5 cursor-pointer">
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover">
                            Đăng Nhập
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
