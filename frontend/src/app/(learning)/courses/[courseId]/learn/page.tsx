'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, CheckCircle2, Circle, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Lesson {
    lesson_id: string;
    order_index: number;
    title: string;
    content_type: 'VIDEO' | 'TEXT' | 'HYBRID';
    video_url: string | null;
    content_body: string | null;
    is_completed: boolean;
}

export default function CourseLearnPage() {
    const params = useParams();
    const router = useRouter();
    
    const courseId = params.courseId as string;
    
    const [learnData, setLearnData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        if (!courseId) return;
        fetchLearningRoom();
    }, [courseId]);

    const fetchLearningRoom = async () => {
        try {
            const res = await api.get(`/courses/${courseId}/learn`);
            if (res.success) {
                setLearnData(res.data);
            }
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải phòng học');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectLesson = (idx: number) => {
        setActiveIdx(idx);
    };

    const handleComplete = async () => {
        const lesson = learnData.lessons[activeIdx];
        setCompleting(true);
        try {
            const res = await api.post(`/users/courses/${courseId}/lessons/${lesson.lesson_id}/complete`, {});
            if (res.success) {
                // Update local status
                const updatedLessons = [...learnData.lessons];
                updatedLessons[activeIdx].is_completed = true;
                
                setLearnData({
                    ...learnData,
                    progress_percentage: res.data.progress_percentage,
                    lessons: updatedLessons
                });

                if (res.data.is_course_just_completed) {
                    alert("Chúc mừng! Bạn đã hoàn thành 100% khóa học!");
                    router.push(`/courses/${courseId}/outro`);
                }
            }
        } catch (err: any) {
            alert(err.message || 'Lỗi khi ghi nhận hoàn thành bài học');
        } finally {
            setCompleting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-24 text-slate-400">Đang tải phòng học...</div>;
    }

    if (error || !learnData) {
        return (
            <div className="text-center py-16 max-w-md mx-auto space-y-4">
                <p className="text-red-400 font-semibold">{error || 'Không tìm thấy phòng học'}</p>
                <button onClick={() => router.push('/courses')} className="inline-flex h-9 items-center justify-center rounded-md bg-white/5 border border-white/10 px-4 text-xs font-semibold text-white">
                    Quay lại danh mục
                </button>
            </div>
        );
    }

    const currentLesson: Lesson = learnData.lessons[activeIdx];
    const progress = learnData.progress_percentage;

    return (
        <div className="flex h-screen flex-col bg-[#0B0F19]">
            {/* Topbar focused navigation */}
            <div className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0E1322] px-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.push(`/courses/${courseId}/intro`)} 
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                        <h2 className="font-bold text-white text-sm sm:text-base leading-tight truncate max-w-[200px] sm:max-w-xs">{learnData.course_title}</h2>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Phòng Học Khoa Học</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 font-semibold">Tiến độ: {progress}%</span>
                    <div className="w-32 bg-white/5 h-2 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {/* Main Learning Split Screen */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left side: content viewer */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
                    {/* Video Player */}
                    {currentLesson.content_type !== 'TEXT' && currentLesson.video_url && (
                        <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-lg border border-white/5">
                            <video
                                src={currentLesson.video_url}
                                controls
                                className="h-full w-full object-contain"
                            />
                        </div>
                    )}

                    {/* Lesson Meta */}
                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                            Bài {currentLesson.order_index}: {currentLesson.title}
                        </h1>
                        <hr className="border-white/5" />
                    </div>

                    {/* Reading Content */}
                    {currentLesson.content_type !== 'VIDEO' && currentLesson.content_body && (
                        <div 
                            className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm md:text-base p-6 rounded-2xl bg-white/[0.01] border border-white/5"
                            dangerouslySetInnerHTML={{ __html: currentLesson.content_body }}
                        />
                    )}

                    {/* Action buttons footer */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-8">
                        <button
                            onClick={() => handleSelectLesson(activeIdx - 1)}
                            disabled={activeIdx === 0}
                            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-4 text-xs font-semibold text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Bài Trước
                        </button>

                        <button
                            onClick={handleComplete}
                            disabled={currentLesson.is_completed || completing}
                            className={`inline-flex h-10 items-center gap-2 rounded-md px-6 text-xs font-bold text-white transition-all cursor-pointer ${
                                currentLesson.is_completed 
                                    ? 'bg-success/20 border border-success/30 text-success' 
                                    : 'bg-primary hover:bg-primary-hover'
                            }`}
                        >
                            {currentLesson.is_completed ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Đã hoàn thành
                                </>
                            ) : completing ? (
                                'Đang ghi nhận...'
                            ) : (
                                'Đánh dấu hoàn thành'
                            )}
                        </button>

                        <button
                            onClick={() => handleSelectLesson(activeIdx + 1)}
                            disabled={activeIdx === learnData.lessons.length - 1}
                            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-4 text-xs font-semibold text-white hover:bg-white/5 disabled:opacity-30 cursor-pointer"
                        >
                            Bài Tiếp
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Right side: Syllabus sidebar */}
                <div className="hidden lg:flex w-80 flex-col border-l border-white/10 bg-[#0E1322] overflow-y-auto">
                    <div className="p-4 border-b border-white/10">
                        <h3 className="font-bold text-white text-sm">Danh mục bài giảng</h3>
                    </div>

                    <div className="py-2">
                        {learnData.lessons.map((lesson: Lesson, idx: number) => (
                            <button
                                key={lesson.lesson_id}
                                onClick={() => handleSelectLesson(idx)}
                                className={`w-full flex items-center justify-between px-5 py-4 text-left border-l-2 transition-all cursor-pointer ${
                                    idx === activeIdx 
                                        ? 'bg-primary/5 border-primary text-primary' 
                                        : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.01]'
                                }`}
                            >
                                <span className="text-xs font-medium leading-normal line-clamp-2 max-w-[200px]">
                                    Bài {lesson.order_index}: {lesson.title}
                                </span>
                                {lesson.is_completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 ml-2" />
                                ) : (
                                    <Circle className="h-4 w-4 text-slate-600 shrink-0 ml-2" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
