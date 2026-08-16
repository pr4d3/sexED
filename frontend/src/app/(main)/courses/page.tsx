'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { BookOpen } from 'lucide-react';

interface Course {
    id: string;
    title: string;
    thumbnail_url: string | null;
    target_audience: 'PARENT' | 'CHILD' | 'BOTH';
    instructor_name: string;
    total_lessons: number;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'CHILD' | 'PARENT'>('ALL');

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                let url = '/courses';
                if (filter !== 'ALL') {
                    url += `?target_audience=${filter}`;
                }
                const res = await api.get(url);
                if (res.success) {
                    setCourses(res.data);
                }
            } catch (err: any) {
                setError(err.message || 'Lỗi khi tải danh sách khóa học');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [filter]);

    return (
        <div className="container mx-auto max-w-7xl px-4 py-12 space-y-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Danh Sách Khóa Học</h1>
                    <p className="text-sm text-slate-400 mt-1">Học liệu chính thống từ đề tài nghiên cứu khoa học</p>
                </div>
                
                {/* Filters */}
                <div className="flex gap-2 p-1 rounded-lg bg-white/5 border border-white/10">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            filter === 'ALL' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => setFilter('CHILD')}
                        className={`px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            filter === 'CHILD' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Trẻ vị thành niên
                    </button>
                    <button
                        onClick={() => setFilter('PARENT')}
                        className={`px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                            filter === 'PARENT' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Phụ huynh
                    </button>
                </div>
            </div>

            {/* Content list */}
            {loading ? (
                <div className="text-center text-slate-400 py-24">Đang tải danh sách khóa học...</div>
            ) : error ? (
                <div className="text-center text-red-400 py-12 border border-red-500/10 rounded-xl bg-red-950/10 max-w-md mx-auto">
                    {error}
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center text-slate-500 py-24">Không tìm thấy khóa học nào phù hợp.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => {
                        const isParent = course.target_audience === 'PARENT';
                        const isChild = course.target_audience === 'CHILD';
                        const badgeText = isParent ? 'Phụ huynh' : isChild ? 'Trẻ nhỏ' : 'Tất cả';
                        const badgeClass = isParent 
                            ? 'border-orange-500/25 bg-orange-500/10 text-accent' 
                            : isChild 
                            ? 'border-violet-500/25 bg-violet-500/10 text-primary' 
                            : 'border-green-500/25 bg-green-500/10 text-green-500';

                        return (
                            <div key={course.id} className="glass-card flex flex-col h-full rounded-2xl overflow-hidden hover:scale-[1.02] hover:border-white/15 transition-all duration-300">
                                <img
                                    src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'}
                                    alt={course.title}
                                    className="w-full h-48 object-cover bg-slate-950"
                                />
                                <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                                    <div className="space-y-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                                            {badgeText}
                                        </span>
                                        <h3 className="font-bold text-white text-lg line-clamp-2 leading-snug">{course.title}</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-xs text-slate-400 border-t border-white/5 pt-4">
                                            <span>Giảng viên: <strong>{course.instructor_name}</strong></span>
                                            <span><strong>{course.total_lessons}</strong> Bài học</span>
                                        </div>
                                        <Link href={`/courses/${course.id}/intro`} className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary text-xs font-semibold text-white transition-colors hover:bg-primary-hover">
                                            Xem Chi Tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
