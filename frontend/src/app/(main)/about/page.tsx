'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { GraduationCap, Award, Mail, BookOpen } from 'lucide-react';

interface Author {
    name: string;
    role: string;
    contact: string;
}

export default function AboutPage() {
    const [aboutData, setAboutData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const res = await api.get('/general/about-us');
                if (res.success) {
                    setAboutData(res.data);
                }
            } catch (err) {
                console.error("Error loading about page data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAboutData();
    }, []);

    const title = aboutData?.research_title || "Nghiên cứu và Ứng dụng Nền tảng E-learning trong Phổ biến Kiến thức Giáo dục Giới tính tại Việt Nam";
    const purpose = aboutData?.research_purpose || "Đề tài hướng tới việc xóa bỏ các rào cản tâm lý e ngại, cung cấp nguồn học liệu chuẩn y khoa, giúp thanh thiếu niên chủ động bảo vệ bản thân và phụ huynh có kỹ năng đồng hành cùng con.";
    const methodology = aboutData?.methodology || "Kết hợp học tập trực tuyến cá nhân hóa theo nhóm đối tượng và diễn đàn trao đổi an toàn.";
    const authors = aboutData?.authors || [
        {
            name: "Nhóm Nghiên cứu Khoa học",
            role: "Tác giả & Phát triển Nền tảng",
            contact: "research.sexed@example.edu.vn"
        }
    ];

    return (
        <div className="container mx-auto max-w-4xl px-4 py-16 space-y-16">
            {/* Header section */}
            <div className="space-y-4 text-center">
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary">
                    <GraduationCap className="h-8 w-8" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Thông Tin Đề Tài Nghiên Cứu
                </h1>
                <p className="text-sm text-slate-400 max-w-xl mx-auto">
                    Nền tảng được phát triển và vận hành phục vụ mục đích nghiên cứu khoa học xã hội và y văn giáo dục.
                </p>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Đang tải thông tin đề tài...</div>
            ) : (
                <div className="space-y-10">
                    {/* Project Title Card */}
                    <div id="project" className="glass-card p-8 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <Award className="h-5 w-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Tên Đề Tài Đăng Ký</span>
                        </div>
                        <h2 className="text-xl font-bold text-white leading-snug">{title}</h2>
                    </div>

                    {/* Mission & Purpose */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card p-6 rounded-xl space-y-3">
                            <div className="flex items-center gap-2 text-accent">
                                <BookOpen className="h-5 w-5" />
                                <h3 className="font-bold text-white">Mục Tiêu Đề Tài</h3>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">{purpose}</p>
                        </div>
                        <div className="glass-card p-6 rounded-xl space-y-3">
                            <div className="flex items-center gap-2 text-green-500">
                                <BookOpen className="h-5 w-5" />
                                <h3 className="font-bold text-white">Phương Pháp Tiếp Cận</h3>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">{methodology}</p>
                        </div>
                    </div>

                    {/* Authors List */}
                    <div id="team" className="space-y-6">
                        <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Nhóm Tác Giả & Nghiên Cứu</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {authors.map((author: Author, idx: number) => (
                                <div key={idx} className="glass-card p-6 rounded-xl border border-white/5 space-y-3">
                                    <div>
                                        <h4 className="font-bold text-white text-base">{author.name}</h4>
                                        <span className="text-xs text-primary font-medium">{author.role}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                                        <span>{author.contact}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Academic Feedback */}
                    <div id="contact" className="glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-4">
                        <h3 className="text-lg font-bold text-white">Đóng Góp Ý Kiến Học Thuật</h3>
                        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                            Mọi ý kiến đóng góp, phản biện học thuật từ các cơ quan nghiên cứu hoặc nhà giáo dục xin vui lòng gửi về email chính thức của Ban chủ nhiệm đề tài để được đối thoại trực tiếp.
                        </p>
                        <a href="mailto:research.sexed@example.edu.vn" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-xs font-semibold text-white transition-colors hover:bg-primary-hover">
                            Gửi email đóng góp
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
