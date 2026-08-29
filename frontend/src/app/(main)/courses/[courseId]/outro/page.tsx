'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import confetti from 'canvas-confetti';

export default function CourseOutroPage() {
    const params = useParams();
    const router = useRouter();
    
    const courseId = params.courseId as string;
    
    const [outroData, setOutroData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!courseId) return;

        const fetchOutro = async () => {
            try {
                const res = await api.get(`/courses/${courseId}/outro`);
                if (res.success) {
                    setOutroData(res.data);
                    triggerConfetti();
                }
            } catch (err: any) {
                setError(err.message || 'Bạn chưa hoàn thành khóa học này (Cần đạt 100% tiến độ).');
            } finally {
                setLoading(false);
            }
        };
        fetchOutro();
    }, [courseId]);

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-on-surface-variant text-sm font-semibold animate-pulse">Đang kiểm tra tiến trình hoàn thành...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 max-w-md mx-auto space-y-6">
                <div className="w-16 h-16 mx-auto bg-red-50 text-error rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-3xl">error</span>
                </div>
                <h2 className="text-lg font-bold text-on-surface">Khóa học chưa hoàn thành</h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">{error}</p>
                <button 
                    onClick={() => router.push(`/courses/${courseId}/learn`)} 
                    className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all"
                >
                    Quay lại học bài
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center relative overflow-hidden px-4 py-12 bg-gradient-to-br from-surface to-surface-container-high">
            {/* Soft-UI Floating Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary-fixed/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-10 w-80 h-80 bg-secondary-fixed/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-tertiary-fixed/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Main Content Container (Glassmorphic) */}
            <main className="relative z-10 w-full max-w-[800px] bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/60 overflow-hidden flex flex-col">
                {/* Header Section */}
                <div className="px-6 py-10 md:px-12 md:py-12 flex flex-col items-center text-center border-b border-outline-variant/30 bg-white/40">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary-container to-secondary flex items-center justify-center mb-6 shadow-sm relative">
                        <div className="absolute inset-0 rounded-full bg-secondary-container blur-xl opacity-40"></div>
                        <span className="material-symbols-outlined text-white relative z-10 text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-on-surface mb-3 leading-tight">
                        Chúc mừng bạn đã xuất sắc hoàn thành khóa học!
                    </h1>
                    <h3 className="text-sm font-extrabold text-primary mb-2 uppercase tracking-wide">{outroData?.course_title}</h3>
                    <p className="text-sm text-on-surface-variant font-light leading-relaxed max-w-lg">
                        {outroData?.outro_content || 'Chúc mừng bạn đã xuất sắc học xong toàn bộ giáo án. Hy vọng những kiến thức khoa học này giúp bạn tự tin hiểu rõ bản thân.'}
                    </p>
                </div>

                {/* Content Body */}
                <div className="px-6 py-8 md:px-12 md:py-10 bg-transparent flex flex-col gap-8">
                    {/* Summary Box */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Giá trị cốt lõi bạn nhận được</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Key Message 1 */}
                            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 flex items-start gap-4 border border-white/80 shadow-sm">
                                <div className="p-2.5 rounded-xl bg-primary-fixed/50 text-primary flex-shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-on-surface mb-1">An Toàn &amp; Sức Khỏe</h3>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">Hiểu rõ các biện pháp bảo vệ bản thân theo tiêu chuẩn y tế.</p>
                                </div>
                            </div>
                            {/* Key Message 2 */}
                            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 flex items-start gap-4 border border-white/80 shadow-sm">
                                <div className="p-2.5 rounded-xl bg-tertiary-fixed/50 text-tertiary flex-shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">diversity_3</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-on-surface mb-1">Tôn Trọng Ranh Giới</h3>
                                    <p className="text-xs text-on-surface-variant leading-relaxed">Kỹ năng xác định và tôn trọng ranh giới cá nhân trong mọi mối quan hệ.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* AI Roleplay Simulation Recommendation Box */}
                    <section className="bg-gradient-to-r from-primary/10 via-tertiary-fixed/30 to-secondary-fixed/20 rounded-3xl p-6 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white text-primary flex items-center justify-center shadow-sm flex-shrink-0">
                                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                            </div>
                            <div className="text-left space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-extrabold text-on-surface">Thực hành phản xạ với AI Roleplay</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-black uppercase">Đề xuất</span>
                                </div>
                                <p className="text-xs text-on-surface-variant leading-relaxed font-light">
                                    Áp dụng kiến thức vừa học vào 4 phòng giả lập tình huống thực tế cùng AI để nhận chứng nhận và đánh giá phản xạ y khoa!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/game')}
                            className="w-full md:w-auto flex-shrink-0 h-11 px-6 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Vào Phòng Chơi AI</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                    </section>

                    {/* Survey Box */}
                    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/20 space-y-4 text-left">
                        <h4 className="font-bold text-primary text-sm">Phiếu Khảo Sát Đóng Góp Đề Tài Khoa Học</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed font-light">
                            Nhằm nâng cao chất lượng nguồn học liệu giáo dục giới tính y văn tại Việt Nam, sự đóng góp ý kiến từ bạn có giá trị khoa học rất lớn. Xin vui lòng gửi phản hồi qua phiếu khảo sát ẩn danh sau.
                        </p>
                        <a 
                            href={outroData?.research_survey_url || 'https://forms.gle/research_feedback_sexed'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-sm"
                        >
                            Làm Khảo Sát Nghiên Cứu (2 Phút)
                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        </a>
                    </div>

                    {/* Navigations */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-outline-variant/20">
                        <button 
                            onClick={() => router.push('/courses')}
                            className="h-11 px-6 rounded-full bg-primary text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer shadow-sm"
                        >
                            Học khóa học khác
                        </button>
                        <button 
                            onClick={() => router.push('/')}
                            className="h-11 px-6 rounded-full border border-outline/30 bg-white/50 text-xs font-bold text-on-surface hover:bg-white transition-colors cursor-pointer"
                        >
                            Về Trang chủ
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
