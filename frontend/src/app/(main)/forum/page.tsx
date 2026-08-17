'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface Category {
    id: number;
    name: string;
    description: string | null;
}

interface Post {
    id: string;
    title: string;
    short_content: string;
    category_name: string;
    author: {
        full_name: string;
        role: string;
    };
    comment_count: number;
    created_at: string;
}

export default function ForumPage() {
    const { user } = useAuth();
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCat, setSelectedCat] = useState<number | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCatId, setNewCatId] = useState<number | null>(null);
    const [newContent, setNewContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const searchTimer = useRef<any>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/forum/categories');
                if (res.success) {
                    setCategories(res.data);
                    if (res.data.length > 0) {
                        setNewCatId(res.data[0].id);
                    }
                }
            } catch (err) {
                console.error("Error loading categories", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [selectedCat]);

    const fetchPosts = async (query = '') => {
        setLoading(true);
        try {
            let url = '/forum/posts';
            const params = [];
            if (selectedCat) params.push(`category_id=${selectedCat}`);
            if (query) params.push(`search=${encodeURIComponent(query)}`);
            
            if (params.length > 0) {
                url += '?' + params.join('&');
            }
            
            const res = await api.get(url);
            if (res.success) {
                setPosts(res.data);
            }
        } catch (err) {
            console.error("Error loading posts", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            fetchPosts(value);
        }, 500);
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatId || !newTitle || !newContent) return;

        setSubmitting(true);
        try {
            const res = await api.post('/forum/posts', {
                category_id: newCatId,
                title: newTitle,
                content: newContent,
            });

            if (res.success) {
                setModalOpen(false);
                setNewTitle('');
                setNewContent('');
                fetchPosts();
            }
        } catch (err: any) {
            alert(err.message || "Lỗi khi đăng bài viết");
        } finally {
            setSubmitting(false);
        }
    };

    const isAdmin = user?.role === 'ADMIN';

    return (
        <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-8">
            {/* Main Content (Forum Canvas) */}
            <main className="flex-grow space-y-8">
                {/* Header Section */}
                <div className="space-y-6">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-on-surface">Cộng đồng thảo luận</h1>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                            <input 
                                className="w-full pl-12 pr-6 py-3.5 bg-white/80 border border-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm transition-all" 
                                placeholder="Tìm kiếm chủ đề, câu hỏi..." 
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        {user && (
                            <button 
                                onClick={() => setModalOpen(true)}
                                className="bg-primary text-white px-8 py-3.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-md cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Đặt câu hỏi
                            </button>
                        )}
                    </div>

                    {/* Topic Chips */}
                    <div className="flex flex-wrap gap-2.5 pt-2">
                        <button 
                            onClick={() => setSelectedCat(null)}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
                                selectedCat === null 
                                    ? 'bg-primary text-white' 
                                    : 'bg-white/80 border border-white/50 text-on-surface-variant hover:bg-white'
                            }`}
                        >
                            Tất cả
                        </button>
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCat(cat.id)}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
                                    selectedCat === cat.id 
                                        ? 'bg-primary text-white' 
                                        : 'bg-white/80 border border-white/50 text-on-surface-variant hover:bg-white'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Post Feed */}
                {loading ? (
                    <div className="text-center text-on-surface-variant text-xs font-semibold py-16 animate-pulse">Đang tải các bài thảo luận...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-on-surface-variant/80 text-sm font-light py-16">Chưa có bài viết nào trong mục này.</div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/forum/${post.id}`}
                                className="block bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/60 shadow-sm hover:border-primary/25 hover:shadow-md transition-all duration-300"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {post.author.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-on-surface">{post.author.full_name}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                        post.author.role === 'ADMIN' 
                                                            ? 'bg-red-50 text-error border border-error/25' 
                                                            : post.author.role === 'INSTRUCTOR'
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'bg-surface-container text-on-surface-variant'
                                                    }`}>
                                                        {post.author.role === 'ADMIN' ? 'Admin' : post.author.role === 'INSTRUCTOR' ? 'Chuyên gia' : 'Học viên'}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-on-surface-variant block mt-0.5">
                                                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="inline-block px-3 py-1 rounded-full bg-secondary-container/10 text-secondary-container border border-secondary-container/25 text-[9px] font-bold uppercase">
                                            {post.category_name}
                                        </span>
                                    </div>

                                    <h2 className="text-sm sm:text-base font-bold text-on-surface hover:text-primary transition-colors leading-snug">
                                        {post.title}
                                    </h2>
                                    <p className="text-xs text-on-surface-variant font-light leading-relaxed line-clamp-2">
                                        {post.short_content}
                                    </p>

                                    <div className="flex items-center gap-6 pt-4 border-t border-outline-variant/10 text-xs text-on-surface-variant">
                                        <div className="flex items-center gap-1.5 font-bold">
                                            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                                            <span>{post.comment_count} bình luận</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Right Sidebar (Admin/Moderation Tools context) */}
            {isAdmin && (
                <aside className="w-full lg:w-[320px] shrink-0">
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-sm sticky top-24 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Công cụ quản trị</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-surface border border-outline-variant/20 shadow-sm transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">report</span>
                                        <span className="text-xs font-bold text-on-surface">Bài viết bị báo cáo</span>
                                    </div>
                                    <span className="bg-error text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white hover:bg-surface border border-outline-variant/20 shadow-sm transition-all cursor-pointer">
                                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">pending_actions</span>
                                    <span className="text-xs font-bold text-on-surface">Chờ duyệt (5)</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white hover:bg-surface border border-outline-variant/20 shadow-sm transition-all cursor-pointer">
                                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">group</span>
                                    <span className="text-xs font-bold text-on-surface">Quản lý thành viên</span>
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-outline-variant/10 space-y-4">
                            <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Thống kê diễn đàn</h4>
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="bg-white border border-outline-variant/20 p-3.5 rounded-2xl shadow-sm">
                                    <span className="text-[10px] text-on-surface-variant font-medium block">Tổng bài viết</span>
                                    <strong className="text-base font-extrabold text-on-surface mt-1 block">1,248</strong>
                                </div>
                                <div className="bg-white border border-outline-variant/20 p-3.5 rounded-2xl shadow-sm">
                                    <span className="text-[10px] text-on-surface-variant font-medium block">Thành viên mới</span>
                                    <strong className="text-base font-extrabold text-on-surface mt-1 block">342</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            )}

            {/* Create Thread Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/95 p-8 shadow-lg relative">
                        <button 
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                        
                        <h3 className="text-base font-extrabold text-on-surface mb-6">Tạo thảo luận mới</h3>

                        <form onSubmit={handleCreatePost} className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="catSelect">
                                    Chuyên mục
                                </label>
                                <select 
                                    id="catSelect"
                                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    value={newCatId || ''}
                                    onChange={(e) => setNewCatId(parseInt(e.target.value))}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="postTitle">
                                    Tiêu đề câu hỏi / chia sẻ
                                </label>
                                <input 
                                    id="postTitle"
                                    type="text"
                                    required
                                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="Tiêu đề in đậm tóm tắt câu hỏi của bạn..."
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="postBody">
                                    Nội dung chi tiết
                                </label>
                                <textarea 
                                    id="postBody"
                                    required
                                    rows={5}
                                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                    placeholder="Mô tả cụ thể thắc mắc, bối cảnh tâm sinh lý cần hướng dẫn..."
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full flex h-11 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                            >
                                {submitting ? 'Đang gửi...' : 'Đăng thảo luận'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
