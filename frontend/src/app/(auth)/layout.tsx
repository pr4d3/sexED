'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLogin = pathname === '/login';

    return (
        <div className="bg-surface text-on-surface min-h-screen w-full flex flex-col lg:flex-row p-4 lg:p-6 gap-6 bg-gradient-to-br from-surface to-surface-container-low font-sans antialiased overflow-x-hidden">
            {/* Left Side: Illustration & Message */}
            <div className="hidden lg:flex w-1/2 bg-surface-container-lowest/50 backdrop-blur-sm rounded-[2rem] flex-col justify-center items-center p-12 relative overflow-hidden shadow-sm border border-white/60">
                {/* Background Soft Shapes */}
                <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary-fixed/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-tertiary-fixed/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-secondary-fixed/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                
                <div className="z-10 max-w-md text-center">
                    <img 
                        className="w-full h-auto mb-8 rounded-[2rem] object-contain drop-shadow-xl" 
                        alt="Safe Sex Education Illustration" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsiyh6bFSuXSuCrjsf6Bf7piF2fQ-fR_AqzwgGj7Rt6vN9NJ3eR8thPqU3NI6ckUUgpJhtE2eJLicVNwUh2dATYjkI-s462wFpkkCIrJVfjBhOwJK5TiWdc5--DEgJY38IV6u5JzNw9zEhYNOGx7fO2X1aoKwqzkcq6hhC1Bl9HM25dJPdaUjWhwl3GQfivxkudE6XgYPLllKQc0c_FSjpY9nPzU19zYAEFCFtWO7jTD5507bWPcILbg"
                    />
                    <h1 className="text-2xl font-bold text-primary mb-4 drop-shadow-sm">Kiến thức là Sức mạnh</h1>
                    <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                        Nền tảng giáo dục giới tính an toàn, khoa học và đáng tin cậy. Xây dựng môi trường học tập cởi mở và tôn trọng.
                    </p>
                </div>
            </div>

            {/* Right Side: Auth Forms */}
            <div className="w-full lg:w-1/2 flex justify-center items-center min-h-[calc(100vh-2rem)] lg:h-full py-8 lg:py-0 overflow-y-auto">
                <div className="w-full max-w-md glass-panel rounded-[2rem] p-8 flex flex-col gap-6 shadow-md border border-white/50 bg-white/70 backdrop-blur-md">
                    {/* Branding */}
                    <div className="text-center mb-2">
                        <h2 className="text-2xl font-extrabold text-primary">Khởi đầu Hành trình</h2>
                        <p className="text-sm text-on-surface-variant mt-2">
                            {isLogin ? 'Đăng nhập vào hệ thống' : 'Tạo tài khoản mới'}
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex p-1.5 bg-white/50 backdrop-blur-md rounded-2xl mb-2 border border-white/60 shadow-inner">
                        <Link 
                            href="/register" 
                            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                                !isLogin 
                                    ? 'bg-white text-primary shadow-sm font-bold' 
                                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/30'
                            }`}
                        >
                            Đăng ký
                        </Link>
                        <Link 
                            href="/login" 
                            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold text-center transition-all ${
                                isLogin 
                                    ? 'bg-white text-primary shadow-sm font-bold' 
                                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/30'
                            }`}
                        >
                            Đăng nhập
                        </Link>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
