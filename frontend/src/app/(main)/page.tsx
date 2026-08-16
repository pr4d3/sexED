'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { BookOpen, Users, MessageSquare, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

interface Course {
    id: string;
    title: string;
    thumbnail_url: string | null;
    instructor_name: string;
    total_lessons: number;
}

interface ForumPost {
    id: string;
    title: string;
    category_name: string;
    author_name: string;
    comment_count: number;
    created_at: string;
}

export default function HomePage() {
    const [homeData, setHomeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'PARENT' | 'CHILD'>('CHILD');

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await api.get('/general/home');
                if (res.success) {
                    setHomeData(res.data);
                }
            } catch (err) {
                console.error("Error loading home page data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const heroTitle = homeData?.hero_banner?.title || "Nền tảng Giáo dục Giới tính Trực tuyến An toàn & Khoa học";
    const heroSubtitle = homeData?.hero_banner?.subtitle || "Đồng hành cùng thanh thiếu niên và phụ huynh Việt Nam xây dựng nhận thức đúng đắn.";

    const coursesToRender = activeTab === 'PARENT'
        ? homeData?.parent_courses || []
        : homeData?.child_courses || [];

    return (
        <div className="space-y-24 pb-24">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
                <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
                
                <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium">
                        <Sparkles className="h-3.5 w-3.5" />
                        Đề Tài Nghiên Cứu Khoa Học Cấp Quốc Gia
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto">
                        {heroTitle}
                    </h1>
                    
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {heroSubtitle}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/courses" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
                            Khám phá khóa học
                        </Link>
                        <Link href="/about" className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                            Tìm hiểu đề tài
                        </Link>
                    </div>
                </div>
            </section>

            {/* Core Values / 3 Pillars */}
            <section className="container mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-card p-8 rounded-2xl space-y-4">
                        <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Chuẩn Y Khoa & Khoa Học</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Mọi thông tin học liệu đều được biên soạn dựa trên nghiên cứu khoa học và kiểm duyệt bởi chuyên gia y tế uy tín.
                        </p>
                    </div>
                    <div className="glass-card p-8 rounded-2xl space-y-4">
                        <div className="inline-flex p-3 rounded-lg bg-accent/10 text-accent">
                            <Heart className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Thân Thiện & Không Rào Cản</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Sử dụng ngôn ngữ cởi mở, minh họa sinh động, phù hợp tâm lý từng độ tuổi dậy thì của trẻ em Việt Nam.
                        </p>
                    </div>
                    <div className="glass-card p-8 rounded-2xl space-y-4">
                        <div className="inline-flex p-3 rounded-lg bg-green-500/10 text-green-500">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Cộng Đồng Thảo Luận An Toàn</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Diễn đàn cộng đồng hỏi đáp an toàn, bảo vệ danh tính, và được kiểm duyệt 24/7 từ đội ngũ Admin.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tabbed Courses Section */}
            <section className="container mx-auto max-w-7xl px-4 space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Chương trình đào tạo cốt lõi</h2>
                    <p className="text-sm text-slate-400">Chọn nhóm đối tượng phù hợp để khám phá các bài giảng</p>
                    
                    <div className="inline-flex p-1 rounded-lg bg-white/5 border border-white/10">
                        <button
                            onClick={() => setActiveTab('CHILD')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === 'CHILD' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <BookOpen className="h-4 w-4" />
                            Dành Cho Học Sinh / Trẻ Nhỏ
                        </button>
                        <button
                            onClick={() => setActiveTab('PARENT')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === 'PARENT' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Users className="h-4 w-4" />
                            Dành Cho Phụ Huynh
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400">Đang tải danh sách khóa học nổi bật...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {coursesToRender.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-slate-500">Chưa có khóa học nổi bật nào.</div>
                        ) : (
                            coursesToRender.map((course: Course) => (
                                <div key={course.id} className="glass-card flex flex-col h-full rounded-2xl overflow-hidden hover:scale-[1.02] hover:border-white/15 transition-all duration-300">
                                    <img
                                        src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'}
                                        alt={course.title}
                                        className="w-full h-48 object-cover bg-slate-950"
                                    />
                                    <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Học Liệu Y Khoa</span>
                                            <h3 className="font-bold text-white text-lg line-clamp-2">{course.title}</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-white/5 pt-4">
                                                <span>Giảng viên: <strong>{course.instructor_name}</strong></span>
                                                <span><strong>{course.total_lessons}</strong> Bài học</span>
                                            </div>
                                            <Link href={`/courses/${course.id}/intro`} className="w-full inline-flex h-10 items-center justify-center rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-white transition-colors hover:bg-white/10">
                                                Xem Chi Tiết
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>

            {/* Recent Forum Discussions */}
            <section className="container mx-auto max-w-5xl px-4 space-y-12">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-white">Thảo luận nổi bật</h2>
                        <p className="text-sm text-slate-400 mt-1">Cộng đồng chia sẻ kiến thức giáo dục giới tính cởi mở</p>
                    </div>
                    <Link href="/forum" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                        Đến diễn đàn
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-6 text-slate-400">Đang tải tin bài mới...</div>
                    ) : !homeData?.recent_forum_posts || homeData.recent_forum_posts.length === 0 ? (
                        <div className="text-center py-6 text-slate-500">Chưa có bài viết thảo luận nào.</div>
                    ) : (
                        homeData.recent_forum_posts.map((post: ForumPost) => (
                            <Link
                                key={post.id}
                                href={`/forum/${post.id}`}
                                className="block glass-card p-6 rounded-xl hover:bg-white/5 transition-all border border-white/10 hover:border-primary/30"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <span className="inline-flex px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">
                                            {post.category_name}
                                        </span>
                                        <h3 className="font-bold text-white text-base hover:text-primary transition-colors">{post.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span>Đăng bởi: <strong>{post.author_name}</strong></span>
                                            <span>•</span>
                                            <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                        <MessageSquare className="h-4 w-4 text-primary" />
                                        <span>{post.comment_count} phản hồi</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
