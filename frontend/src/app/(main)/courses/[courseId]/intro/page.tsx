'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CourseIntroSkeleton } from '@/components/Skeleton';
import { useToast } from '@/context/ToastContext';

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
    const { showToast } = useToast();

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
                showToast("Đăng ký khóa học thành công!", "success");
                router.push(`/courses/${courseId}/learn`);
            }
        } catch (err: any) {
            showToast(err.message || "Lỗi khi đăng ký khóa học", "error");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return <CourseIntroSkeleton />;
    }

    if (error || !courseData) {
        return (
            <div className="text-center py-16 max-w-md mx-auto space-y-6">
                <div className="w-16 h-16 mx-auto bg-red-50 text-error rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-3xl">error</span>
                </div>
                <h2 className="text-lg font-bold text-on-surface">Không tìm thấy khóa học này</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">{error}</p>
                <button onClick={() => router.push('/courses')} className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all">
                    Quay lại danh mục
                </button>
            </div>
        );
    }

    const isParent = courseData.target_audience === 'PARENT';
    const isChild = courseData.target_audience === 'CHILD';
    const audienceText = isParent ? 'Phụ huynh' : isChild ? 'Học sinh' : 'Mọi đối tượng';

    return (
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-8">
            {/* Left Column: Main Content (70%) */}
            <div className="w-full lg:w-[70%] space-y-10">
                {/* Hero section */}
                <section className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-semibold">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                        Dành cho {audienceText}
                    </div>
                    <h1 className="text-2xl md:text-4xl font-extrabold text-on-surface leading-tight">
                        {courseData.title}
                    </h1>
                    <p className="text-base text-on-surface-variant font-light leading-relaxed">
                        {courseData.description || 'Chưa có mô tả chi tiết cho khóa học này. Hãy bắt đầu lộ trình học tập để tích lũy kiến thức chuẩn khoa học ngay hôm nay.'}
                    </p>

                    {/* Learning Objectives */}
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50 mt-8">
                        <h2 className="text-lg font-bold text-on-surface mb-6">Mục tiêu học tập</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                <span className="text-sm text-on-surface-variant font-medium">Tiếp cận các kiến thức giáo dục giới tính chuẩn y văn và tâm lý.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                <span className="text-sm text-on-surface-variant font-medium">Sở hữu phương pháp và ngôn từ nhẹ nhàng, tự nhiên khi chia sẻ.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                <span className="text-sm text-on-surface-variant font-medium">Biết cách định hướng và trả lời những thắc mắc tế nhị của trẻ.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                <span className="text-sm text-on-surface-variant font-medium">Hỗ trợ xây dựng kỹ năng tự bảo vệ cơ thể và phòng vệ xâm hại.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Syllabus Accordion */}
                <section className="space-y-6">
                    <button 
                        onClick={() => setExpandedSyllabus(!expandedSyllabus)}
                        className="w-full flex items-center justify-between border-b border-outline-variant/30 pb-3 text-left cursor-pointer select-none"
                    >
                        <h2 className="text-lg font-bold text-on-surface">Đề cương bài học</h2>
                        <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${expandedSyllabus ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    
                    {expandedSyllabus && (
                        <div className="space-y-4 transition-all">
                            {courseData.syllabus.length === 0 ? (
                                <p className="text-sm text-on-surface-variant/80">Đề cương đang được cập nhật.</p>
                            ) : (
                                courseData.syllabus.map((lesson: SyllabusItem) => (
                                    <div key={lesson.id} className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 flex justify-between items-center transition-all hover:border-primary/20">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary/10 text-primary w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                                                {lesson.order_index}
                                            </div>
                                            <h3 className="font-bold text-on-surface text-sm">{lesson.title}</h3>
                                        </div>
                                        {lesson.duration_minutes && (
                                            <span className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                {lesson.duration_minutes} phút
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>

                {/* Instructor Card */}
                <section className="pt-4">
                    <h2 className="text-lg font-bold text-on-surface mb-6">Giảng viên của bạn</h2>
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                        <img 
                            className="w-20 h-20 rounded-full object-cover shadow-sm bg-primary-fixed" 
                            alt={courseData.instructor.full_name} 
                            src={courseData.instructor.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLgNlt8oxrJXRkbLEhGWQB1WaLOqf9Zm7fBANEhyCLI3WBvhBT1fFopS25w1iSYvOj7ChfPef3vVnlOy4-2IfSJh9cSEEDdOHVz1f0RxGNFvC6S9pytVBlevtz6tEDiHNgYyDr2GmyZE3sjiypqLWOCkhf2du7uRwTKYADj9nXtFS3CrbKEQUi9agqpKyN-LZtQr9-UkMUYQ-Z1npuTPGg-Zb0iumqS2vauThTOXStUxw7mMeHr-dUXw'}
                        />
                        <div className="text-center sm:text-left space-y-2">
                            <h3 className="text-base font-bold text-on-surface">{courseData.instructor.full_name}</h3>
                            <p className="text-xs font-semibold text-primary">Bác sĩ chuyên khoa Tâm lý - Nhi khoa</p>
                            <p className="text-xs text-on-surface-variant font-light leading-relaxed pt-2">
                                {courseData.instructor.bio || 'Chuyên gia giàu kinh nghiệm trong lĩnh vực tư vấn tâm lý trẻ em và giáo dục giới tính học đường tại các bệnh viện nhi uy tín.'}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Right Column: Sticky Sidebar (30%) */}
            <aside className="w-full lg:w-[30%]">
                <div className="sticky top-24 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 overflow-hidden">
                    {/* Course Thumbnail */}
                    <div className="relative w-full h-48 sm:h-56 bg-surface-container">
                        <img 
                            className="w-full h-full object-cover" 
                            alt={courseData.title} 
                            src={courseData.thumbnail_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9-sxq6hwgyme01rYTAWAZzCHGgH8DuSQtNxeTBNyeagcRB66jUv-pKFaK84qEbPi-1JCa6Apc_NeHXJCFfYyURKkzLpD4ZwIAmfCzJ_MqJxX598zjHbSPR66nKvVfG5hpgqfgP7Lgh8aPTVF10p2aeCZqQQEKXgG_Go_krqDOYALphZ_tJUPtZqrshdB0Y57Q-fI1nmcOBVyQFaqp5ytmflg2-mbg3FWJWKJa5Ik9ZY-zNZoxf9Qkjg'}
                        />
                        <div onClick={handleAction} className="absolute inset-0 flex items-center justify-center bg-black/15 hover:bg-black/25 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                                <span className="material-symbols-outlined text-primary text-3xl ml-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Status */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-on-surface">Miễn phí</span>
                        </div>

                        {/* Course Meta */}
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center justify-between text-on-surface-variant border-b border-outline-variant/20 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                                    <span>Thời lượng</span>
                                </div>
                                <span className="font-bold text-on-surface">{courseData.total_lessons} bài học</span>
                            </div>
                            <div className="flex items-center justify-between text-on-surface-variant border-b border-outline-variant/20 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                                    <span>Học liệu</span>
                                </div>
                                <span className="font-bold text-on-surface">Chuẩn Y văn</span>
                            </div>
                            <div className="flex items-center justify-between text-on-surface-variant pb-1">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                                    <span>Đạt được</span>
                                </div>
                                <span className="font-bold text-on-surface">Chứng nhận</span>
                            </div>
                        </div>

                        {/* Action Button (Orange Secondary Accent) */}
                        <button 
                            onClick={handleAction}
                            disabled={enrolling}
                            className="w-full bg-gradient-to-r from-secondary-container to-secondary text-white text-xs font-bold py-4 px-6 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {enrolling ? 'Đang xử lý...' : courseData.is_enrolled ? 'Vào học ngay' : 'Đăng ký khóa học'}
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </aside>
        </main>
    );
}
