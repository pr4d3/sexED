'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import confetti from 'canvas-confetti';
import { Award, ArrowRight, ExternalLink } from 'lucide-react';

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
                    // Fire fireworks confetti
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
        return <div className="text-center py-24 text-slate-400">Đang kiểm tra tiến trình hoàn thành...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-20 max-w-md mx-auto space-y-4">
                <p className="text-red-400 font-semibold">{error}</p>
                <button 
                    onClick={() => router.push(`/courses/${courseId}/learn`)} 
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover cursor-pointer"
                >
                    Quay lại học bài
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-16 space-y-10 text-center">
            {/* Achievement Icon */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/10 text-success border border-success/20 animate-bounce">
                <Award className="h-12 w-12" />
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Chúc Mừng Hoàn Thành!</h1>
                <h3 className="text-lg font-bold text-accent">{outroData?.course_title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
                    {outroData?.outro_content || 'Chúc mừng bạn đã xuất sắc học xong toàn bộ giáo án. Hy vọng những kiến thức khoa học này giúp bạn tự tin hiểu rõ bản thân.'}
                </p>
            </div>

            {/* Scientific feedback callout */}
            <div className="glass-panel p-6 rounded-2xl border border-success/20 bg-success/5 text-left space-y-4">
                <h4 className="font-bold text-success text-sm sm:text-base">Phiếu Khảo Sát Đóng Góp Đề Tài Khoa Học</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Nhằm nâng cao chất lượng nguồn học liệu giáo dục giới tính y văn tại Việt Nam, sự đóng góp ý kiến từ bạn có giá trị khoa học rất lớn. Xin vui lòng gửi phản hồi qua phiếu khảo sát ẩn danh sau.
                </p>
                <a 
                    href={outroData?.research_survey_url || 'https://forms.gle/research_feedback_sexed'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-md bg-success text-xs font-bold text-white transition-colors hover:bg-green-600"
                >
                    Làm Khảo Sát Nghiên Cứu (2 Phút)
                    <ExternalLink className="h-4 w-4" />
                </a>
            </div>

            {/* Navigations */}
            <div className="flex justify-center gap-4 pt-4 border-t border-white/5">
                <button 
                    onClick={() => router.push('/courses')}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover cursor-pointer"
                >
                    Học khóa học khác
                </button>
                <button 
                    onClick={() => router.push('/')}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 text-xs font-semibold text-white transition-colors hover:bg-white/10 cursor-pointer"
                >
                    Về Trang chủ
                </button>
            </div>
        </div>
    );
}
