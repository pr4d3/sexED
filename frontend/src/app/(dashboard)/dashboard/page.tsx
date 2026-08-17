'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-on-surface">Bảng Thống Kê Giảng Viên</h1>
                    <p className="text-xs text-on-surface-variant font-light mt-1">Chào {user?.full_name}, vai trò quản trị hệ thống.</p>
                </div>
                
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-primary text-white px-6 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Tạo khóa học mới
                </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl text-center border border-white/60 shadow-sm space-y-2">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                    </div>
                    <div className="text-xl font-extrabold text-on-surface">{stats?.total_courses || 0}</div>
                    <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">Khóa học</span>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl text-center border border-white/60 shadow-sm space-y-2">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                    </div>
                    <div className="text-xl font-extrabold text-on-surface">{stats?.total_students_enrolled || 0}</div>
                    <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">Học viên</span>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl text-center border border-white/60 shadow-sm space-y-2">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container/10 text-secondary">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    </div>
                    <div className="text-xl font-extrabold text-on-surface">{stats?.total_completed_students || 0}</div>
                    <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">Tốt nghiệp</span>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl text-center border border-white/60 shadow-sm space-y-2">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-container/10 text-tertiary">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>percent</span>
                    </div>
                    <div className="text-xl font-extrabold text-on-surface">{stats?.average_completion_rate || 0}%</div>
                    <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">Hoàn thành TB</span>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl text-center border border-white/60 shadow-sm space-y-2">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                    </div>
                    <div className="text-xl font-extrabold text-on-surface">{stats?.total_lessons_published || 0}</div>
                    <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">Bài giảng</span>
                </div>
            </div>

            {/* Courses Management Table Wrapper */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-sm space-y-6">
                <h3 className="text-base font-extrabold text-on-surface">Khóa học do tôi quản lý</h3>
                
                {loading ? (
                    <div className="text-on-surface-variant text-xs font-semibold py-6 animate-pulse">Đang tải danh sách khóa học...</div>
                ) : courses.length === 0 ? (
                    <p className="text-xs text-on-surface-variant/85 py-6">Bạn chưa tạo khóa học nào.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-outline-variant/30 text-on-surface-variant font-bold uppercase tracking-wider text-[9px]">
                                    <th className="py-4 px-4 bg-white/20">Khóa học</th>
                                    <th className="py-4 px-4 bg-white/20">Đối tượng</th>
                                    <th className="py-4 px-4 bg-white/20">Số bài học</th>
                                    <th className="py-4 px-4 bg-white/20">Lượt học viên</th>
                                    <th className="py-4 px-4 bg-white/20">Đã xong / Đang học</th>
                                    <th className="py-4 px-4 bg-white/20">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {courses.map((c) => (
                                    <tr key={c.course_id} className="hover:bg-white/40 transition-colors">
                                        <td className="py-4 px-4 font-bold text-on-surface">{c.title}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase ${
                                                c.target_audience === 'PARENT' 
                                                    ? 'border-secondary-container/20 bg-secondary-container/10 text-secondary-container' 
                                                    : c.target_audience === 'CHILD' 
                                                    ? 'border-primary/20 bg-primary/10 text-primary' 
                                                    : 'border-tertiary/20 bg-tertiary/10 text-tertiary'
                                            }`}>
                                                {c.target_audience === 'PARENT' ? 'Phụ huynh' : c.target_audience === 'CHILD' ? 'Học sinh' : 'Cả hai'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-on-surface-variant font-medium">{c.total_lessons} bài</td>
                                        <td className="py-4 px-4 font-bold text-on-surface">{c.total_enrolled}</td>
                                        <td className="py-4 px-4 text-on-surface-variant">
                                            <strong className="text-primary font-bold">{c.completed_count}</strong> tốt nghiệp /{' '}
                                            <strong className="text-secondary font-bold">{c.in_progress_count}</strong> đang học
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                                c.is_published 
                                                    ? 'bg-primary/10 text-primary border border-primary/20' 
                                                    : 'bg-surface-container text-on-surface-variant'
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/95 p-8 shadow-lg relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                        
                        <h3 className="text-base font-extrabold text-on-surface mb-6">Tạo khóa học mới</h3>

                        <form onSubmit={handleCreateCourse} className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="cTitle">
                                    Tiêu đề khóa học
                                </label>
                                <input
                                    id="cTitle"
                                    type="text"
                                    required
                                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="Ví dụ: Giáo dục giới tính tuổi dậy thì"
                                    value={newTitle}
                                    onChange={(e) => {
                                        setNewTitle(e.target.value);
                                        setNewSlug(e.target.value.toLowerCase().trim().replace(/ /g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="cSlug">
                                    Đường dẫn tĩnh (Slug)
                                </label>
                                <input
                                    id="cSlug"
                                    type="text"
                                    required
                                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    value={newSlug}
                                    onChange={(e) => setNewSlug(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="cAudience">
                                    Đối tượng hướng đến
                                </label>
                                <select
                                    id="cAudience"
                                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    value={newAudience}
                                    onChange={(e) => setNewAudience(e.target.value as any)}
                                >
                                    <option value="BOTH">Tất cả đối tượng (BOTH)</option>
                                    <option value="CHILD">Học sinh / Trẻ nhỏ (CHILD)</option>
                                    <option value="PARENT">Phụ huynh (PARENT)</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="cThumb">
                                    Link ảnh Thumbnail
                                </label>
                                <input
                                    id="cThumb"
                                    type="text"
                                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="https://image-url.com/thumb.jpg"
                                    value={newThumb}
                                    onChange={(e) => setNewThumb(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="cShort">
                                    Tóm tắt khóa học
                                </label>
                                <input
                                    id="cShort"
                                    type="text"
                                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="Nội dung chính tóm gọn trong 1 dòng..."
                                    value={newShortDesc}
                                    onChange={(e) => setNewShortDesc(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-on-surface ml-1" htmlFor="cDesc">
                                    Mô tả chi tiết đề cương
                                </label>
                                <textarea
                                    id="cDesc"
                                    rows={4}
                                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                    placeholder="Nhập chi tiết về bài học, mục tiêu..."
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex h-11 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
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
