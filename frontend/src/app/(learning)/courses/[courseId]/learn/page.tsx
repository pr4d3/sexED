"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { LearnPageSkeleton } from "@/components/Skeleton";
import { useToast } from "@/context/ToastContext";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CourseGraduationModal } from "@/components/CourseGraduationModal";
import {
  WarningCircle,
  ArrowLeft,
  Play,
  Video,
  Article,
  Info,
  ArrowRight,
  GraduationCap,
  CheckCircle,
} from "@phosphor-icons/react";

interface Lesson {
  lesson_id: string;
  order_index: number;
  title: string;
  content_type: "VIDEO" | "TEXT" | "HYBRID";
  video_url: string | null;
  content_body: string | null;
  is_completed: boolean;
}

function getCleanLessonTitle(title: string): string {
  if (!title) return "";
  const cleaned = title.replace(/^(bài\s*\d+[\s:.-]*|\d+[\s:.-]+)/i, "").trim();
  return cleaned || title;
}

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const courseId = params.courseId as string;

  const [learnData, setLearnData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [outroInfo, setOutroInfo] = useState<any>(null);
  const { showToast } = useToast();

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
      setError(err.message || "Lỗi khi tải phòng học");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = (idx: number) => {
    if (idx >= 0 && idx < learnData.lessons.length) {
      setActiveIdx(idx);
    }
  };

  const handleNextOrComplete = async () => {
    if (!learnData || !learnData.lessons) return;
    const isLastLesson = activeIdx === learnData.lessons.length - 1;
    const lesson = learnData.lessons[activeIdx];

    // If already on the last lesson and it's completed: directly open graduation modal
    if (isLastLesson && lesson.is_completed) {
      if (!outroInfo) {
        try {
          const outroRes = await api.get(`/courses/${courseId}/outro`);
          if (outroRes.success) {
            setOutroInfo(outroRes.data);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setCompletionModalOpen(true);
      return;
    }

    // If not the last lesson and it's already completed: directly navigate to next lesson
    if (!isLastLesson && lesson.is_completed) {
      setActiveIdx(activeIdx + 1);
      return;
    }

    // Otherwise, submit completion to API
    setCompleting(true);
    try {
      const res = await api.post(
        `/users/courses/${courseId}/lessons/${lesson.lesson_id}/complete`,
        {},
      );
      if (res.success) {
        const updatedLessons = [...learnData.lessons];
        updatedLessons[activeIdx].is_completed = true;

        setLearnData({
          ...learnData,
          progress_percentage: res.data.progress_percentage,
          lessons: updatedLessons,
        });

        if (isLastLesson || res.data.is_course_just_completed) {
          showToast("Chúc mừng bạn đã hoàn thành khóa học!", "success");
          try {
            const outroRes = await api.get(`/courses/${courseId}/outro`);
            if (outroRes.success) {
              setOutroInfo(outroRes.data);
            }
          } catch (e) {
            console.error(e);
          }
          setCompletionModalOpen(true);
        } else {
          showToast("Đã hoàn thành bài học!", "success");
          if (activeIdx < learnData.lessons.length - 1) {
            setActiveIdx(activeIdx + 1);
          }
        }
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi ghi nhận hoàn thành bài học", "error");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return <LearnPageSkeleton />;
  }

  if (error || !learnData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
        <div className="text-center py-16 max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 mx-auto bg-red-50 text-error rounded-2xl flex items-center justify-center shadow-sm">
            <WarningCircle size={32} weight="duotone" />
          </div>
          <h2 className="text-lg font-bold text-on-surface">
            Không thể truy cập phòng học
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => router.push("/courses")}
            className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-all"
          >
            Quay lại danh mục
          </button>
        </div>
      </div>
    );
  }

  const currentLesson: Lesson = learnData.lessons[activeIdx];
  const progress = learnData.progress_percentage || 0;
  const completedCount = learnData.lessons.filter(
    (l: Lesson) => l.is_completed,
  ).length;

  return (
    <div className="flex flex-col h-screen w-full bg-background text-on-background font-sans antialiased overflow-hidden">
      {/* Top Bar: Focus Mode */}
      <header className="glass-panel border-b border-outline-variant/30 sticky top-0 z-50 flex flex-col h-auto w-full bg-white/80">
        <div className="flex items-center justify-between px-6 h-16 w-full max-w-screen-2xl mx-auto">
          <button
            onClick={() => router.push(`/courses/${courseId}/intro`)}
            className="flex items-center gap-2 text-primary hover:text-primary-container transition-colors group p-2 -ml-2 rounded-full hover:bg-surface-container-low cursor-pointer"
          >
            <ArrowLeft
              size={20}
              weight="bold"
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="text-xs font-bold hidden sm:inline">Quay lại</span>
          </button>
          <h1 className="text-sm md:text-base font-extrabold text-on-surface truncate flex-grow text-center px-4">
            Bài {currentLesson.order_index}:{" "}
            {getCleanLessonTitle(currentLesson.title)}
          </h1>
          <div className="w-16 sm:w-24 flex justify-end">
            <span className="text-xs font-bold text-primary">{progress}%</span>
          </div>
        </div>
        {/* Global Progress Bar */}
        <div className="w-full h-1.5 bg-surface-container-high overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out animate-pulse"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row h-[calc(100vh-72px)] overflow-hidden">
        {/* Left Area: Video & Content Canvas */}
        <div className="flex-grow flex flex-col h-full overflow-y-auto bg-surface">
          <div className="p-6 md:p-10 flex-grow">
            {/* Video Player Container (16:9) */}
            {currentLesson.content_type !== "TEXT" &&
            currentLesson.video_url ? (
              <div className="mb-8">
                <VideoPlayer
                  key={currentLesson.lesson_id + currentLesson.video_url}
                  url={currentLesson.video_url}
                  title={currentLesson.title}
                  autoPlay={true}
                />
              </div>
            ) : (
              currentLesson.content_type !== "TEXT" && (
                <div className="w-full aspect-video bg-surface-container rounded-3xl overflow-hidden shadow-sm relative group mb-8 border border-white flex items-center justify-center">
                  <img
                    alt="Video placeholder"
                    className="w-full h-full object-cover opacity-90"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD6l4CMqssz2FaeWNRH-dL5r0RoQHHvOmnNBfJf2lpboSCKJGLGc-yVZaWZ3cNkNZNv8IlwPFsaJtTxm_BMhCQwUpEXhNcN79SlDNoSk2gNMTQwCVbiEqk6R26GWe91h83J96qe7B9mpl3dcQpB8oZtBbtm6gj5yAy7056kN9j26pPICYVDpY5phfb3vSv9LY5I_VG8LPLhz66SS9OGS2ldwNykiuGx1OSyccmdYvXJ_W4j7IYRqF3jw"
                  />
                  <div className="absolute z-10 w-16 h-16 bg-primary/95 text-white rounded-full flex items-center justify-center shadow-md">
                    <Play size={28} weight="fill" className="ml-0.5" />
                  </div>
                </div>
              )
            )}

            {/* Lesson Info */}
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary/10 text-primary px-3.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5">
                  {currentLesson.content_type === "VIDEO" ? (
                    <Video size={14} weight="bold" />
                  ) : (
                    <Article size={14} weight="bold" />
                  )}
                  {currentLesson.content_type === "VIDEO"
                    ? "Video bài giảng"
                    : "Tài liệu đọc"}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-on-surface">
                Bài {currentLesson.order_index}:{" "}
                {getCleanLessonTitle(currentLesson.title)}
              </h2>

              {/* Content Body (Render raw HTML or markdown text) */}
              {currentLesson.content_body ? (
                <div
                  className="prose max-w-none text-on-surface-variant font-light text-sm md:text-base leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: currentLesson.content_body,
                  }}
                />
              ) : (
                <div className="prose max-w-none text-on-surface-variant font-light text-sm md:text-base leading-relaxed space-y-4">
                  <p>
                    Chào mừng bạn đến với bài học này. Trong chương trình giáo
                    dục giới tính chuẩn y khoa, nội dung học tập được thiết kế
                    ngắn gọn, trực quan và dễ hiểu giúp bạn nhanh chóng nắm bắt
                    được các kiến thức cần thiết.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>
                      Cung cấp kiến thức sinh lý học và tâm lý học toàn diện.
                    </li>
                    <li>
                      Rèn luyện kỹ năng nhận biết và hành động bảo vệ bản thân.
                    </li>
                    <li>Bổ sung các tình huống thực tế để dễ dàng ghi nhớ.</li>
                  </ul>
                </div>
              )}

              {/* Safe Info Note */}
              <div className="bg-white p-6 rounded-2xl border border-white/60 shadow-sm flex gap-4 mt-8">
                <Info
                  size={28}
                  weight="duotone"
                  className="text-primary shrink-0"
                />
                <p className="text-xs text-on-surface-variant leading-relaxed m-0 font-light">
                  Mọi thông tin trong bài học này đều được kiểm duyệt bởi các
                  chuyên gia y khoa và được thiết kế để mang lại cảm giác an
                  toàn, tôn trọng và không phán xét.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="sticky bottom-0 glass-panel border-t border-outline-variant/30 p-4 md:px-10 flex items-center justify-between z-20 bg-white/90">
            <button
              onClick={() => handleSelectLesson(activeIdx - 1)}
              disabled={activeIdx === 0}
              className="flex items-center gap-1.5 text-primary hover:bg-surface-container-low px-5 py-2.5 rounded-full transition-colors text-xs font-bold disabled:opacity-30 cursor-pointer"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Bài trước</span>
            </button>
            <button
              onClick={handleNextOrComplete}
              disabled={completing}
              className={`flex items-center gap-1.5 px-8 py-3 rounded-full transition-all text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 ${
                activeIdx === learnData.lessons.length - 1
                  ? "bg-gradient-to-r from-secondary-container to-secondary text-white hover:opacity-95 shadow-lg"
                  : "bg-primary text-white hover:opacity-90"
              }`}
            >
              <span>
                {completing
                  ? "Đang lưu..."
                  : activeIdx === learnData.lessons.length - 1
                    ? "Hoàn thành"
                    : "Bài sau"}
              </span>
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Lesson List */}
        <aside className="w-full lg:w-[360px] flex-shrink-0 glass-panel border-l border-outline-variant/30 flex flex-col h-full overflow-hidden hidden lg:flex relative z-10 bg-white/70">
          <div className="p-6 border-b border-outline-variant/30 sticky top-0 z-10 bg-transparent">
            <h3 className="text-base font-extrabold text-on-surface mb-2">
              Nội dung khóa học
            </h3>
            <div className="flex items-center gap-2 text-on-surface-variant font-bold bg-surface-container-lowest/50 py-1.5 px-3 rounded-full inline-flex border border-white/60">
              <GraduationCap
                size={16}
                weight="duotone"
                className="text-primary"
              />
              <span className="text-[10px] uppercase tracking-wider">
                {completedCount}/{learnData.lessons.length} Bài học hoàn thành
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {learnData.lessons.map((lesson: Lesson, idx: number) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={lesson.lesson_id}
                  onClick={() => handleSelectLesson(idx)}
                  className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 text-left border ${
                    isActive
                      ? "bg-white border-white shadow-sm ring-2 ring-primary/10"
                      : "border-transparent hover:bg-white/40"
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center">
                    {lesson.is_completed ? (
                      <CheckCircle
                        size={18}
                        weight="fill"
                        className="text-primary"
                      />
                    ) : isActive ? (
                      <span className="w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-primary ring-offset-2 ring-offset-white"></span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-outline-variant"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-xs font-bold ${isActive ? "text-primary" : "text-on-surface"}`}
                    >
                      Bài {lesson.order_index}:{" "}
                      {getCleanLessonTitle(lesson.title)}
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-1 flex items-center gap-1.5 font-medium">
                      {lesson.content_type === "VIDEO" ? (
                        <Video size={12} weight="bold" />
                      ) : (
                        <Article size={12} weight="bold" />
                      )}
                      {lesson.content_type === "VIDEO" ? "Video" : "Đọc"} • 15
                      phút
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </main>

      {/* Course Graduation Modal */}
      <CourseGraduationModal
        isOpen={completionModalOpen}
        onClose={() => setCompletionModalOpen(false)}
        courseId={courseId}
        courseTitle={learnData?.course_title}
        outroContent={outroInfo?.outro_content}
        surveyUrl={outroInfo?.research_survey_url}
      />
    </div>
  );
}
