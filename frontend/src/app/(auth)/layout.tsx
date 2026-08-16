import React from 'react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#0B0F19]">
            {/* Left Column: Visual Banner (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-tr from-[#1E1B4B] via-[#0F172A] to-[#311042] flex-col justify-between p-16 text-white overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />

                <div className="relative z-10">
                    <span className="text-2xl font-bold tracking-tight">ChiChan<span className="text-primary">.</span></span>
                </div>
                
                <div className="relative z-10 max-w-xl space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                        Đồng hành cùng trẻ vượt qua <span className="text-accent">dậy thì</span> an toàn
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed font-light">
                        Chúng tôi cung cấp các chương trình giáo dục giới tính chuẩn khoa học y văn, giúp phá bỏ các e ngại tâm lý giữa phụ huynh và trẻ vị thành niên.
                    </p>
                </div>

                <div className="relative z-10 text-xs text-slate-400 font-medium">
                    &copy; 2026 ChiChan SexEd. Đề tài Nghiên cứu Khoa học & Phát triển.
                </div>
            </div>

            {/* Right Column: Form Container */}
            <div className="flex flex-1 flex-col items-center justify-center p-8 sm:p-16 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
