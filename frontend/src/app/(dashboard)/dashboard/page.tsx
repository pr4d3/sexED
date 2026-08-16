'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Users, Award, Percent, FileText, Plus, X } from 'lucide-react';

interface ManagedCourse {
    course_id: string;
    title: string;
    target_audience: 'PARENT' | 'CHILD' | 'BOTH';
    is_published: boolean;
    total_lessons: number;
    total_enrolled: number;
    completed_count: number;
    in_progress_count: number;
    created_at: string;
}

export default function DashboardOverviewPage() {
    const { user } = useAuth();
    
    const [stats, setStats] = useState<any>(null);
    const [courses, setCourses] = useState<ManagedCourse[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newSlug, setNewSlug] = useState('');
    const [newAudience, setNewAudience] = useState<'BOTH' | 'CHILD' | 'PARENT'>('BOTH');
    const [newThumb, setNewThumb] = useState('');
    const [newShortDesc, setNewShortDesc] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchStats();
        fetchManagedCourses();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/instructor/dashboard/overview');
            if (res.success) {
                setStats(res.data);
            }
        } catch (err) {
            console.error("Error loading dashboard stats", err);
        }
    };

    const fetchManagedCourses = async () => {
        try {
            const res = await api.get('/instructor/dashboard/courses');
            if (res.success) {
                setCourses(res.data);
            }
        } catch (err) {
            console.error("Error loading managed courses", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newSlug) return;

        setSubmitting(true);
        try {
            const res = await api.post('/courses', {
                title: newTitle,
                slug: newSlug,
                target_audience: newAudience,
                thumbnail_url: newThumb || null,
                short_description: newShortDesc || null,
                description: newDesc || null,
            });

            if (res.success) {
                alert("Tạo khóa học mới thành công!");
                setModalOpen(false);
                
                // Clear fields
                setNewTitle('');
                setNewSlug('');
                setNewThumb('');
                setNewShortDesc('');
                setNewDesc('');
                
                fetchStats();
                fetchManagedCourses();
            }
        } catch (err: any) {
            alert(err.message || 'Lỗi khi tạo khóa học');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Bảng Thống Kê Giảng Viên</h1>
                    <p className="text-xs text-slate-400 mt-1">Chào {user?.full_name}, vai trò: {user?.role}</p>
                </div>
                
                <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-xs font-bold text-white transition-colors hover:bg-primary-hover cursor-pointer"
                >
                    <Plus className="h-4 w-4" />
                    Tạo khóa học mới
                </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="glass-card p-6 rounded-2xl text-center space-y-2 border border-white/5">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.total_courses || 0}</div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Khóa học</span>
                </div>

                <div className="glass-card p-6 rounded-2xl text-center space-y-2 border border-white/5">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                        <Users className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.total_students_enrolled || 0}</div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Học viên</span>
                </div>

                <div className="glass-card p-6 rounded-2xl text-center space-y-2 border border-white/5">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Award className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.total_completed_students || 0}</div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Đã tốt nghiệp</span>
                </div>

                <div className="glass-card p-6 rounded-2xl text-center space-y-2 border border-white/5">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                        <Percent className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.average_completion_rate || 0}%</div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Tỷ lệ xong TB</span>
                </div>

                <div className="glass-card p-6 rounded-2xl text-center space-y-2 border border-white/5">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats?.total_lessons_published || 0}</div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Bài giảng</span>
                </div>
            </div>

            {/* Courses Management Table */}
            <div className="glass-panel p-6 rounded-2xl space-y-6">
                <h3 className="text-base font-bold text-white">Khóa học do tôi quản lý</h3>
                
                {loading ? (
                    <div className="text-slate-400 py-6">Đang tải danh sách khóa học...</div>
                ) : courses.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6">Bạn chưa tạo khóa học nào.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="py-3.5 px-4 bg-white/[0.01]">Khóa học</th>
                                    <th className="py-3.5 px-4 bg-white/[0.01]">Đối tượng</th>
                                    <th className="py-3.5 px-4 bg-white/[0.01]">Số bài học</th>
                                    <th className="py-3.5 px-4 bg-white/[0.01]">Lượt học viên</th>
                                    <th className="py-3.5 px-4 bg-white/[0.01]">Xong / Đang học</th>
                                    <th className="py-3.5 px-4 bg-white/[0.01]">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((c) => (
                                    <tr key={c.course_id} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                                        <td className="py-4 px-4 font-bold text-slate-200">{c.title}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${
                                                c.target_audience === 'PARENT' 
                                                    ? 'border-orange-500/30 bg-orange-500/10 text-accent' 
                                                    : c.target_audience === 'CHILD' 
                                                    ? 'border-violet-500/30 bg-violet-500/10 text-primary' 
                                                    : 'border-green-500/30 bg-green-500/10 text-green-500'
                                            }`}>
                                                {c.target_audience}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-slate-300">{c.total_lessons} bài</td>
                                        <td className="py-4 px-4 font-bold text-white">{c.total_enrolled}</td>
                                        <td className="py-4 px-4 text-slate-400">
                                            <strong className="text-green-500">{c.completed_count}</strong> tốt nghiệp /{' '}
                                            <strong className="text-yellow-500">{c.in_progress_count}</strong> đang học
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                                c.is_published 
                                                    ? 'bg-green-500/10 text-green-500' 
                                                    : 'bg-white/5 text-slate-400'
                                            }`}>
                                                {c.is_published ? 'Public' : 'Bản nháp'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Course Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0E1322] p-6 shadow-2xl relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        <h3 className="text-lg font-bold text-white mb-6">Tạo khóa học mới</h3>

                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="cTitle">
                                    Tiêu đề khóa học
                                </label>
                                <input
                                    id="cTitle"
                                    type="text"
                                    required
                                    className="w-full rounded-md border border-white/10 bg-[#070A12] px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-primary focus:outline-none"
                                    placeholder="Ví dụ: Giáo dục giới tính tuổi dậy thì"
                                    value={newTitle}
                                    onChange={(e) => {
                                        setNewTitle(e.target.value);
                                        // Auto slug
                                        setNewSlug(e.target.value.toLowerCase().trim().replace(/ /g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="cSlug">
                                    Đường dẫn tĩnh (Slug)
                                </label>
                                <input
                                    id="cSlug"
                                    type="text"
                                    required
                                    className="w-full rounded-md border border-white/10 bg-[#070A12] px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                                    value={newSlug}
                                    onChange={(e) => setNewSlug(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="cAudience">
                                    Đối tượng hướng đến
                                </label>
                                <select
                                    id="cAudience"
                                    className="w-full rounded-md border border-white/10 bg-[#070A12] px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none"
                                    value={newAudience}
                                    onChange={(e) => setNewAudience(e.target.value as any)}
                                >
                                    <option value="BOTH">Tất cả đối tượng (BOTH)</option>
                                    <option value="CHILD">Học sinh / Trẻ nhỏ (CHILD)</option>
                                    <option value="PARENT">Phụ huynh (PARENT)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="cThumb">
                                    Link ảnh Thumbnail
                                </label>
                                <input
                                    id="cThumb"
                                    type="text"
                                    className="w-full rounded-md border border-white/10 bg-[#070A12] px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-primary focus:outline-none"
                                    placeholder="https://image-url.com/thumb.jpg"
                                    value={newThumb}
                                    onChange={(e) => setNewThumb(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="cShort">
                                    Tóm tắt khóa học
                                </label>
                                <input
                                    id="cShort"
                                    type="text"
                                    className="w-full rounded-md border border-white/10 bg-[#070A12] px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-primary focus:outline-none"
                                    placeholder="Nội dung chính tóm gọn trong 1 dòng..."
                                    value={newShortDesc}
                                    onChange={(e) => setNewShortDesc(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="cDesc">
                                    Mô tả chi tiết đề cương
                                </label>
                                <textarea
                                    id="cDesc"
                                    rows={4}
                                    className="w-full rounded-md border border-white/10 bg-[#070A12] px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-primary focus:outline-none"
                                    placeholder="Nhập chi tiết về bài học, mục tiêu thu nhận kiến thức khoa học..."
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex h-11 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
                            >
                                {submitting ? 'Đang tạo...' : 'Tạo khóa học (Nháp)'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
