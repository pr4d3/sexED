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
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-surface/80 border-b border-outline-variant/30">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex items-center justify-center w-8 h-8 bg-primary rounded-lg group-hover:scale-105 transition-transform shadow-sm">
                        <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>shield</span>
                        <span className="material-symbols-outlined text-white absolute bottom-[2px] right-[2px] text-[8px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </div>
                    <span className="text-lg font-extrabold tracking-tight text-primary">EduSex VN</span>
                </Link>
                
                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/" className={`text-sm transition-colors ${isLinkActive('/') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary font-medium'}`}>
                        Trang Chủ
                    </Link>
                    <Link href="/courses" className={`text-sm transition-colors ${isLinkActive('/courses') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary font-medium'}`}>
                        Khóa Học
                    </Link>
                    <Link href="/forum" className={`text-sm transition-colors ${isLinkActive('/forum') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary font-medium'}`}>
                        Diễn Đàn
                    </Link>
                    <Link href="/about" className={`text-sm transition-colors ${isLinkActive('/about') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary font-medium'}`}>
                        Về Chúng Tôi
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link href="/profile" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
                                Chào, <span className="underline decoration-primary decoration-2 font-semibold">{user.full_name}</span>
                            </Link>
                            {(user.role === 'ADMIN' || user.role === 'INSTRUCTOR') && (
                                <Link href="/dashboard" className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-primary-container px-4 text-xs font-semibold text-on-primary-container transition-opacity hover:opacity-90">
                                    Dashboard
                                </Link>
                            )}
                            <button onClick={logout} className="h-9 items-center justify-center rounded-full border border-outline/30 px-4 text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hidden md:inline-flex h-9 items-center justify-center text-sm font-medium text-primary hover:bg-surface-container-high px-4 rounded-full transition-colors">
                                Đăng nhập
                            </Link>
                            <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-full bg-primary-container px-5 text-xs font-semibold text-on-primary-container transition-opacity hover:opacity-90 shadow-sm">
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
