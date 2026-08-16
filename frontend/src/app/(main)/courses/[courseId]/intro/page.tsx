'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Play, BookOpen, Clock, HelpCircle } from 'lucide-react';

interface SyllabusItem {
    id: string;
    order_index: number;
    title: string;
    duration_minutes: number | null;
}

export default function CourseIntroPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    
    const courseId = params.courseId as string;
    
    const [courseData, setCourseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enrolling, setEnrolling] = useState(false);
    const [expandedSyllabus, setExpandedSyllabus] = useState<boolean>(true);

    useEffect(() => {
        if (!courseId) return;

        const fetchCourseDetail = async () => {
            try {
                const res = await api.get(`/courses/${courseId}/intro`);
                if (res.success) {
                    setCourseData(res.data);
                }
            } catch (err: any) {
                setError(err.message || 'Lỗi khi tải chi tiết khóa học');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetail();
    }, [courseId]);

    const handleAction = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (courseData.is_enrolled) {
            router.push(`/courses/${courseId}/learn`);
            return;
        }

        setEnrolling(true);
        try {
            const res = await api.post(`/courses/${courseId}/enroll`, {});
            if (res.success) {
                alert("Đăng ký khóa học thành công!");
                router.push(`/courses/${courseId}/learn`);
            }
        } catch (err: any) {
            alert(err.message || "Lỗi khi đăng ký khóa học");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return <div className="text-center py-24 text-slate-400">Đang tải chi tiết khóa học...</div>;
    }

    if (error || !courseData) {
        return (
            <div className="text-center py-16 max-w-md mx-auto space-y-4">
                <p className="text-red-400 font-semibold">{error || 'Không tìm thấy khóa học này'}</p>
                <button onClick={() => router.push('/courses')} className="inline-flex h-9 items-center justify-center rounded-md bg-white/5 border border-white/10 px-4 text-xs font-semibold text-white">
                    Quay lại danh mục
                </button>
            </div>
        );
    }

    const isParent = courseData.target_audience === 'PARENT';
    const isChild = courseData.target_audience === 'CHILD';
    const audienceText = isParent ? 'Phụ huynh' : isChild ? 'Trẻ dậy thì' : 'Mọi đối tượng';

    return (
        <div className="container mx-auto max-w-7xl px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left side: Course information */}
                <div className="lg:col-span-2 space-y-8">
                    <img
                        src={courseData.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                        alt={courseData.title}
                        className="w-full h-80 object-cover rounded-2xl border border-white/10 bg-slate-950"
                    />

                    <div className="space-y-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent">Học Liệu Phổ Phổ Thông</span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{courseData.title}</h1>
                        <p className="text-slate-400 text-sm leading-relaxed">{courseData.description || 'Chưa có mô tả chi tiết cho khóa học này.'}</p>
                    </div>

                    {/* Syllabus */}
                    <div className="space-y-4">
                        <button 
                            onClick={() => setExpandedSyllabus(!expandedSyllabus)}
                            className="w-full flex items-center justify-between border-b border-white/10 pb-2 text-left cursor-pointer select-none"
                        >
                            <h3 className="text-lg font-bold text-white">Đề cương bài học</h3>
                            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${expandedSyllabus ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {expandedSyllabus && (
                            <div className="space-y-3 transition-all duration-300">
                                {courseData.syllabus.length === 0 ? (
                                    <p className="text-sm text-slate-500">Đề cương đang được cập nhật.</p>
                                ) : (
                                    courseData.syllabus.map((lesson: SyllabusItem) => (
                                        <div key={lesson.id} className="glass-card p-4 rounded-xl flex justify-between items-center border border-white/5 hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                                    {lesson.order_index}
                                                </div>
                                                <h4 className="font-semibold text-white text-sm">{lesson.title}</h4>
                                            </div>
                                            {lesson.duration_minutes && (
                                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                                                    {lesson.duration_minutes} phút
                                                </span>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side: Sidebar sticky card */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 rounded-2xl space-y-6 sticky top-24 border border-white/10">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">Đăng ký khóa học</h3>
                            <div className="space-y-2 text-sm text-slate-400">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>Đối tượng:</span>
                                    <span className="font-bold text-slate-200">{audienceText}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>Số bài học:</span>
                                    <span className="font-bold text-slate-200">{courseData.total_lessons} bài</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAction}
                            disabled={enrolling}
                            className={`w-full flex h-12 items-center justify-center rounded-md text-sm font-bold text-white transition-colors cursor-pointer ${
                                courseData.is_enrolled 
                                    ? 'bg-accent hover:bg-accent-hover' 
                                    : 'bg-primary hover:bg-primary-hover'
                            }`}
                        >
                            {enrolling ? 'Đang xử lý...' : courseData.is_enrolled ? 'Vào học ngay' : 'Đăng ký khóa học'}
                        </button>

                        {/* Instructor card */}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                            <img
                                src={courseData.instructor.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                                alt="Instructor Avatar"
                                className="h-10 w-10 object-cover rounded-full bg-primary"
                            />
                            <div>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Giảng viên phụ trách</span>
                                <strong className="text-white text-xs font-bold">{courseData.instructor.full_name}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
