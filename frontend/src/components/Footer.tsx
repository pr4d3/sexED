import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full py-12 px-4 md:px-16 bg-surface-container-lowest border-t border-outline-variant/30 mt-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Brand Column */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-all duration-300 w-fit">
                        <div className="relative flex items-center justify-center w-8 h-8 bg-primary rounded-full shadow-sm">
                            <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                        </div>
                        <span className="text-md font-bold text-primary">EduSex VN</span>
                    </Link>
                    <p className="text-xs text-on-surface-variant/80">
                        © 2026 EduSex VN. Nền tảng Giáo dục Giới tính Chuẩn Khoa học.
                    </p>
                </div>
                
                {/* Links Column 1 */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">Pháp lý & Điều khoản</h4>
                    <Link className="text-on-surface-variant hover:text-primary transition-colors text-xs w-fit" href="#">
                        Chính sách bảo mật
                    </Link>
                    <Link className="text-on-surface-variant hover:text-primary transition-colors text-xs w-fit" href="#">
                        Điều khoản sử dụng
                    </Link>
                </div>
                
                {/* Links Column 2 */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">Khám phá</h4>
                    <Link className="text-on-surface-variant hover:text-primary transition-colors text-xs w-fit" href="/about">
                        Đội ngũ nghiên cứu
                    </Link>
                    <Link className="text-on-surface-variant hover:text-primary transition-colors text-xs w-fit" href="/courses">
                        Danh sách khóa học
                    </Link>
                    <Link className="text-on-surface-variant hover:text-primary transition-colors text-xs w-fit" href="/forum">
                        Diễn đàn thảo luận
                    </Link>
                </div>
            </div>
        </footer>
    );
}
