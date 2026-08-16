import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-white/10 bg-[#070A12] py-12 text-slate-400">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
                            ChiChan<span className="text-primary">.</span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm">
                            Nền tảng giáo dục giới tính y khoa hàng đầu Việt Nam giúp đồng hành cùng con trẻ và phụ huynh vượt dậy thì.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Đường dẫn nhanh</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Trang Chủ</Link></li>
                            <li><Link href="/courses" className="hover:text-white transition-colors">Khóa Học</Link></li>
                            <li><Link href="/forum" className="hover:text-white transition-colors">Diễn Đàn</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">Giới Thiệu</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Nghiên cứu khoa học</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about#project" className="hover:text-white transition-colors">Về đề tài</Link></li>
                            <li><Link href="/about#team" className="hover:text-white transition-colors">Nhóm nghiên cứu</Link></li>
                            <li><Link href="/about#contact" className="hover:text-white transition-colors">Liên hệ học thuật</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs space-y-4 sm:space-y-0">
                    <p>&copy; 2026 ChiChan SexEd Platform. Nghiên cứu khoa học & Phát triển.</p>
                    <p className="text-slate-500 font-medium">An toàn - Khoa học - Kín đáo</p>
                </div>
            </div>
        </footer>
    );
}
