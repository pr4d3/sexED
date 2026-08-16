'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare, Plus, Search, HelpCircle, X } from 'lucide-react';

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
                alert("Đăng bài viết mới thành công!");
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

    return (
        <div className="container mx-auto max-w-7xl px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Left Side: Category filters & Action CTA */}
                <div className="lg:col-span-1 space-y-6">
                    {user && (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="w-full flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-white transition-colors hover:bg-primary-hover cursor-pointer"
                        >
                            <Plus className="h-4.5 w-4.5" />
                            Tạo thảo luận
                        </button>
                    )}

                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                        <h3 className="font-bold text-white text-sm">Chuyên mục diễn đàn</h3>
                        <div className="flex flex-col space-y-1">
                            <button
                                onClick={() => setSelectedCat(null)}
                                className={`text-left px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    selectedCat === null ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                Tất cả chuyên mục
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCat(cat.id)}
                                    className={`text-left px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        selectedCat === cat.id ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Search and feed list */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl font-bold text-white">Thảo luận cộng đồng</h2>
                        
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                className="w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-all"
                                placeholder="Tìm kiếm câu hỏi..."
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center text-slate-400 py-16">Đang tải các bài thảo luận...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center text-slate-500 py-16">Chưa có bài viết nào trong mục này.</div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/forum/${post.id}`}
                                    className="block glass-card p-6 rounded-xl border border-white/5 hover:border-primary/30 hover:bg-white/[0.01] transition-all"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase">
                                                {post.category_name}
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        
                                        <h3 className="font-bold text-white text-base hover:text-primary transition-colors leading-snug">{post.title}</h3>
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{post.short_content}</p>
                                        
                                        <div className="flex justify-between items-center border-t border-white/5 pt-4 text-xs text-slate-500">
                                            <span>
                                                Bởi: <strong className="text-slate-300">{post.author.full_name}</strong> ({
                                                    post.author.role === 'ADMIN' ? 'Admin' : post.author.role === 'INSTRUCTOR' ? 'Giảng viên' : 'Học viên'
                                                })
                                            </span>
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <MessageSquare className="h-4 w-4 text-primary" />
                                                {post.comment_count}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Thread Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E1322] p-6 shadow-2xl relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        <h3 className="text-lg font-bold text-white mb-6">Tạo thảo luận mới</h3>

                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="catSelect">
                                    Chuyên mục
                                </label>
                                <select
                                    id="catSelect"
                                    className="w-full rounded-md border border-white/10 bg-[#070A12] px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                                    value={newCatId || ''}
                                    onChange={(e) => setNewCatId(parseInt(e.target.value))}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="postTitle">
                                    Tiêu đề câu hỏi / chia sẻ
                                </label>
                                <input
                                    id="postTitle"
                                    type="text"
                                    required
                                    className="w-full rounded-md border border-white/10 bg-[#070A12] px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-primary focus:outline-none"
                                    placeholder="Tiêu đề in đậm tóm tắt câu hỏi của bạn..."
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="postBody">
                                    Nội dung chi tiết
                                </label>
                                <textarea
                                    id="postBody"
                                    required
                                    rows={5}
                                    className="w-full rounded-md border border-white/10 bg-[#070A12] px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-primary focus:outline-none"
                                    placeholder="Mô tả cụ thể thắc mắc, bối cảnh tâm sinh lý cần hướng dẫn..."
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex h-11 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
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
