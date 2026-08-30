"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface ManagedCourse {
  course_id: string;
  title: string;
  target_audience: "PARENT" | "CHILD" | "BOTH";
  is_published: boolean;
  total_lessons: number;
  total_enrolled: number;
  completed_count: number;
  in_progress_count: number;
  created_at: string;
}

interface SyllabusLesson {
  id: string;
  order_index: number;
  title: string;
  duration_minutes: number | null;
}

interface CourseDetails {
  course_id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  thumbnail_url: string | null;
  target_audience: "PARENT" | "CHILD" | "BOTH";
  learning_objectives: string | null;
  outro_content: string | null;
  syllabus: SyllabusLesson[];
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<ManagedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected course for detailed management
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(
    null,
  );
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "lessons">("basic");

  // Create Course Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAudience, setNewAudience] = useState<"BOTH" | "CHILD" | "PARENT">(
    "BOTH",
  );
  const [newThumb, setNewThumb] = useState("");
  const [newShortDesc, setNewShortDesc] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newObjectives, setNewObjectives] = useState("");
  const [newOutroContent, setNewOutroContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Course Form states (within detail view)
  const [editTitle, setEditTitle] = useState("");
  const [editAudience, setEditAudience] = useState<"BOTH" | "CHILD" | "PARENT">(
    "BOTH",
  );
  const [editThumb, setEditThumb] = useState("");
  const [editShortDesc, setEditShortDesc] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editObjectives, setEditObjectives] = useState("");
  const [editOutroContent, setEditOutroContent] = useState("");

  // Lesson Modal states
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContentType, setLessonContentType] = useState<
    "VIDEO" | "TEXT" | "HYBRID"
  >("HYBRID");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonContentBody, setLessonContentBody] = useState("");
  const [lessonOrderIndex, setLessonOrderIndex] = useState<number>(1);
  const [lessonDuration, setLessonDuration] = useState<number | "">("");
  const [lessonSubmitting, setLessonSubmitting] = useState(false);

  // Drag and Drop States
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [isDraggingAllowed, setIsDraggingAllowed] = useState(false);

  const editDescRef = useRef<HTMLTextAreaElement>(null);
  const editObjectivesRef = useRef<HTMLTextAreaElement>(null);
  const editOutroRef = useRef<HTMLTextAreaElement>(null);
  const lessonBodyRef = useRef<HTMLTextAreaElement>(null);
  const cDescRef = useRef<HTMLTextAreaElement>(null);
  const cObjectivesRef = useRef<HTMLTextAreaElement>(null);
  const cOutroRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editDescRef.current) {
      editDescRef.current.style.height = "auto";
      if (editDesc) {
        editDescRef.current.style.height = `${editDescRef.current.scrollHeight}px`;
      }
    }
  }, [editDesc]);

  useEffect(() => {
    if (editObjectivesRef.current) {
      editObjectivesRef.current.style.height = "auto";
      if (editObjectives) {
        editObjectivesRef.current.style.height = `${editObjectivesRef.current.scrollHeight}px`;
      }
    }
  }, [editObjectives]);

  useEffect(() => {
    if (editOutroRef.current) {
      editOutroRef.current.style.height = "auto";
      if (editOutroContent) {
        editOutroRef.current.style.height = `${editOutroRef.current.scrollHeight}px`;
      }
    }
  }, [editOutroContent]);

  useEffect(() => {
    if (lessonBodyRef.current) {
      lessonBodyRef.current.style.height = "auto";
      if (lessonContentBody) {
        lessonBodyRef.current.style.height = `${lessonBodyRef.current.scrollHeight}px`;
      }
    }
  }, [lessonContentBody]);

  useEffect(() => {
    if (cDescRef.current) {
      cDescRef.current.style.height = "auto";
      if (newDesc) {
        cDescRef.current.style.height = `${cDescRef.current.scrollHeight}px`;
      }
    }
  }, [newDesc]);

  useEffect(() => {
    if (cObjectivesRef.current) {
      cObjectivesRef.current.style.height = "auto";
      if (newObjectives) {
        cObjectivesRef.current.style.height = `${cObjectivesRef.current.scrollHeight}px`;
      }
    }
  }, [newObjectives]);

  useEffect(() => {
    if (cOutroRef.current) {
      cOutroRef.current.style.height = "auto";
      if (newOutroContent) {
        cOutroRef.current.style.height = `${cOutroRef.current.scrollHeight}px`;
      }
    }
  }, [newOutroContent]);

  useEffect(() => {
    fetchStats();
    fetchManagedCourses();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/instructor/dashboard/overview");
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Error loading dashboard stats", err);
    }
  };

  const fetchManagedCourses = async () => {
    try {
      const res = await api.get("/instructor/dashboard/courses");
      if (res.success) {
        setCourses(res.data);
      }
    } catch (err) {
      console.error("Error loading managed courses", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId: string) => {
    setDetailsLoading(true);
    try {
      const res = await api.get(`/courses/${courseId}/intro`);
      if (res.success) {
        const data: CourseDetails = res.data;
        setCourseDetails(data);

        // Populate edit fields
        setEditTitle(data.title);
        setEditAudience(data.target_audience);
        setEditThumb(data.thumbnail_url || "");
        setEditShortDesc(data.short_description || "");
        setEditDesc(data.description || "");
        setEditObjectives(data.learning_objectives || "");
        setEditOutroContent(data.outro_content || "");
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi tải chi tiết khóa học", "error");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveTab("basic");
    fetchCourseDetails(courseId);
  };

  const handleBackToOverview = () => {
    setSelectedCourseId(null);
    setCourseDetails(null);
    fetchStats();
    fetchManagedCourses();
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    setSubmitting(true);
    // Automatically generate slug from title (remove Vietnamese accents and make URL-safe)
    const slug = newTitle
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/([^a-z0-9\s-]|_)+/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    try {
      const res = await api.post("/courses", {
        title: newTitle,
        slug: slug,
        target_audience: newAudience,
        thumbnail_url: newThumb || null,
        short_description: newShortDesc || null,
        description: newDesc || null,
        learning_objectives: newObjectives || null,
        outro_content: newOutroContent || null,
      });

      if (res.success) {
        showToast("Tạo khóa học mới thành công!", "success");
        setModalOpen(false);

        // Clear fields
        setNewTitle("");
        setNewThumb("");
        setNewShortDesc("");
        setNewDesc("");
        setNewObjectives("");
        setNewOutroContent("");

        fetchStats();
        fetchManagedCourses();
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi tạo khóa học", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle || !selectedCourseId) return;

    setSubmitting(true);
    const slug = editTitle
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/([^a-z0-9\s-]|_)+/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    try {
      const res = await api.put(`/courses/${selectedCourseId}`, {
        title: editTitle,
        slug: slug,
        target_audience: editAudience,
        thumbnail_url: editThumb || null,
        short_description: editShortDesc || null,
        description: editDesc || null,
        learning_objectives: editObjectives || null,
        outro_content: editOutroContent || null,
      });

      if (res.success) {
        showToast("Cập nhật thông tin khóa học thành công!", "success");
        fetchCourseDetails(selectedCourseId);
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi cập nhật thông tin khóa học", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourseId) return;
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn XÓA VĨNH VIỄN khóa học này cùng toàn bộ các bài học bên trong? Hành động này không thể khôi phục!",
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/courses/${selectedCourseId}`);
      if (res.success) {
        showToast("Đã xóa khóa học thành công!", "success");
        handleBackToOverview();
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi xóa khóa học", "error");
    }
  };

  const handleTogglePublish = async (courseId: string) => {
    try {
      const res = await api.put(`/courses/${courseId}/publish`, {});
      if (res.success) {
        showToast(res.message || "Cập nhật trạng thái thành công!", "success");
        fetchStats();
        fetchManagedCourses();
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi cập nhật trạng thái xuất bản", "error");
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex || !courseDetails)
      return;

    setIsReordering(true);
    const newSyllabus = [...courseDetails.syllabus];
    const [draggedItem] = newSyllabus.splice(draggedIndex, 1);
    newSyllabus.splice(targetIndex, 0, draggedItem);

    // Re-assign order_index based on new index
    const reorderedSyllabus = newSyllabus.map((item, idx) => ({
      ...item,
      order_index: idx + 1,
    }));

    setCourseDetails({
      ...courseDetails,
      syllabus: reorderedSyllabus,
    });

    setDraggedIndex(null);

    try {
      const lessonIds = reorderedSyllabus.map((item) => item.id);
      const res = await api.put(
        `/courses/${selectedCourseId}/lessons/reorder`,
        { lesson_ids: lessonIds },
      );
      if (res.success) {
        showToast("Sắp xếp thứ tự bài học thành công!", "success");
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi sắp xếp thứ tự bài học", "error");
      fetchCourseDetails(selectedCourseId!);
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Lesson Operations
  const clearLessonForm = () => {
    setSelectedLessonId(null);
    setLessonTitle("");
    setLessonContentType("HYBRID");
    setLessonVideoUrl("");
    setLessonContentBody("");
    setLessonOrderIndex((courseDetails?.syllabus.length || 0) + 1);
    setLessonDuration("");
  };

  const handleOpenAddLesson = () => {
    clearLessonForm();
    setLessonModalOpen(true);
  };

  const handleOpenEditLesson = async (lessonId: string) => {
    try {
      const res = await api.get(
        `/courses/${selectedCourseId}/lessons/${lessonId}`,
      );
      if (res.success) {
        const lesson = res.data;
        setSelectedLessonId(lessonId);
        setLessonTitle(lesson.title);
        setLessonContentType(lesson.content_type);
        setLessonVideoUrl(lesson.video_url || "");
        setLessonContentBody(lesson.content_body || "");
        setLessonOrderIndex(lesson.order_index);
        setLessonDuration(lesson.duration_minutes || "");
        setLessonModalOpen(true);
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi tải thông tin bài học", "error");
    }
  };

  const extractVideoIdentifier = (input: string | null | undefined): string | null => {
    if (!input) return null;
    const trimmed = input.trim();
    if (!trimmed) return null;
    const ytMatch = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i,
    );
    if (ytMatch && ytMatch[1]) return ytMatch[1];
    const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/i);
    if (vimeoMatch && vimeoMatch[1]) return vimeoMatch[1];
    return trimmed;
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle || !selectedCourseId) return;

    setLessonSubmitting(true);
    const cleanedVideo = extractVideoIdentifier(lessonVideoUrl);

    const payload = {
      title: lessonTitle,
      content_type: lessonContentType,
      video_url: cleanedVideo,
      content_body: lessonContentBody || null,
      order_index: Number(lessonOrderIndex),
      duration_minutes: lessonDuration ? Number(lessonDuration) : null,
    };

    try {
      let res;
      if (selectedLessonId) {
        res = await api.put(
          `/courses/${selectedCourseId}/lessons/${selectedLessonId}`,
          payload,
        );
      } else {
        res = await api.post(`/courses/${selectedCourseId}/lessons`, payload);
      }

      if (res.success) {
        showToast(
          selectedLessonId
            ? "Cập nhật bài học thành công!"
            : "Thêm bài học mới thành công!",
          "success",
        );
        setLessonModalOpen(false);
        clearLessonForm();
        fetchCourseDetails(selectedCourseId);
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi lưu thông tin bài học", "error");
    } finally {
      setLessonSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!selectedCourseId) return;
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa bài học này?",
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete(
        `/courses/${selectedCourseId}/lessons/${lessonId}`,
      );
      if (res.success) {
        showToast("Đã xóa bài học thành công!", "success");
        fetchCourseDetails(selectedCourseId);
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi xóa bài học", "error");
    }
  };

  // If a course is selected, render the management view
  if (selectedCourseId) {
    return (
      <div className="space-y-8">
        {/* Back and Title */}
        <div className="flex flex-col gap-3 pb-6 border-b border-outline-variant/30">
          <button
            onClick={handleBackToOverview}
            className="flex items-center gap-2 text-xs font-bold text-primary hover:opacity-80 transition-all w-fit cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            Quay lại Tổng quan
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                Quản lý khóa học
              </span>
              <h1 className="text-xl md:text-2xl font-extrabold text-on-surface mt-0.5">
                {courseDetails?.title || "Đang tải..."}
              </h1>
            </div>
            {courseDetails && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary`}
              >
                {courseDetails.syllabus.length} bài học
              </span>
            )}
          </div>
        </div>

        {detailsLoading ? (
          <div className="h-60 flex items-center justify-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab Switcher */}
            <div className="flex border-b border-outline-variant/20 gap-8">
              <button
                onClick={() => setActiveTab("basic")}
                className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
                  activeTab === "basic"
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Thông tin cơ bản
                {activeTab === "basic" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("lessons")}
                className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
                  activeTab === "lessons"
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Đề cương bài giảng
                {activeTab === "lessons" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </div>

            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-sm space-y-6">
                <form onSubmit={handleUpdateCourse} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-semibold text-on-surface ml-1"
                        htmlFor="editTitle"
                      >
                        Tiêu đề khóa học
                      </label>
                      <input
                        id="editTitle"
                        type="text"
                        required
                        className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        className="text-xs font-semibold text-on-surface ml-1"
                        htmlFor="editAudience"
                      >
                        Đối tượng hướng đến
                      </label>
                      <select
                        id="editAudience"
                        className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        value={editAudience}
                        onChange={(e) => setEditAudience(e.target.value as any)}
                      >
                        <option value="BOTH">Tất cả đối tượng</option>
                        <option value="CHILD">Học sinh / Trẻ nhỏ</option>
                        <option value="PARENT">Phụ huynh</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface ml-1"
                      htmlFor="editThumb"
                    >
                      Link ảnh Thumbnail
                    </label>
                    <input
                      id="editThumb"
                      type="text"
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      value={editThumb}
                      onChange={(e) => setEditThumb(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface ml-1"
                      htmlFor="editShort"
                    >
                      Tóm tắt khóa học
                    </label>
                    <input
                      id="editShort"
                      type="text"
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      value={editShortDesc}
                      onChange={(e) => setEditShortDesc(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface ml-1"
                      htmlFor="editDesc"
                    >
                      Mô tả chi tiết đề cương
                    </label>
                    <textarea
                      ref={editDescRef}
                      id="editDesc"
                      rows={5}
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none overflow-hidden"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface ml-1"
                      htmlFor="editObjectives"
                    >
                      Mục tiêu học tập (mỗi mục tiêu 1 dòng)
                    </label>
                    <textarea
                      ref={editObjectivesRef}
                      id="editObjectives"
                      rows={4}
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none overflow-hidden"
                      placeholder={"- Tiếp cận các kiến thức giáo dục giới tính chuẩn y khoa\n- Rèn luyện kỹ năng tự bảo vệ bản thân và phòng chống xâm hại\n- Nắm vững kiến thức sinh lý và tâm lý theo độ tuổi"}
                      value={editObjectives}
                      onChange={(e) => setEditObjectives(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface ml-1"
                      htmlFor="editOutro"
                    >
                      Lời chúc mừng hoàn thành
                    </label>
                    <textarea
                      ref={editOutroRef}
                      id="editOutro"
                      rows={3}
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none overflow-hidden"
                      placeholder="Nội dung sẽ hiện khi học viên tốt nghiệp khóa học (Lời nhắn nhủ, chúc mừng, hướng dẫn khảo sát...)"
                      value={editOutroContent}
                      onChange={(e) => setEditOutroContent(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-outline-variant/10">
                    <button
                      type="button"
                      onClick={handleDeleteCourse}
                      className="w-full sm:w-auto px-6 h-11 rounded-full border border-red-500 text-red-500 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer"
                    >
                      Xóa khóa học này
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 h-11 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lessons Tab */}
            {activeTab === "lessons" && (
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-extrabold text-on-surface">
                    Đề cương bài học
                  </h3>
                  <button
                    onClick={handleOpenAddLesson}
                    className="bg-primary text-white px-4 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add
                    </span>
                    Thêm bài học
                  </button>
                </div>

                {!courseDetails || courseDetails.syllabus.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">
                      menu_book
                    </span>
                    <p className="text-xs text-on-surface-variant font-light">
                      Khóa học này chưa có bài học nào. Hãy thiết kế bài học đầu
                      tiên!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-outline-variant/10">
                    {courseDetails.syllabus.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        draggable={isDraggingAllowed && !isReordering}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`flex justify-between items-center py-4 first:pt-0 last:pb-0 group transition-all select-none ${
                          draggedIndex === index
                            ? "opacity-40 bg-primary/5 rounded-2xl px-2"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            onMouseEnter={() => setIsDraggingAllowed(true)}
                            onMouseLeave={() => setIsDraggingAllowed(false)}
                            className="flex items-center gap-2 cursor-grab active:cursor-grabbing p-1 hover:bg-primary/5 rounded-2xl transition-all"
                            title="Kéo thả để sắp xếp"
                          >
                            <span className="material-symbols-outlined text-[18px] text-on-surface-variant/35 group-hover:text-primary transition-colors">
                              drag_indicator
                            </span>
                            <div className="h-8 w-8 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                              {lesson.order_index}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                              {lesson.title}
                            </h4>
                            <p className="text-[10px] text-on-surface-variant font-light mt-0.5">
                              Thời lượng: {lesson.duration_minutes || "--"} phút
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditLesson(lesson.id)}
                            className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-primary transition-colors cursor-pointer"
                            title="Sửa bài giảng"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="h-8 w-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 transition-colors cursor-pointer"
                            title="Xóa bài giảng"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Lesson Create/Edit Modal */}
        {lessonModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/95 p-8 shadow-lg relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setLessonModalOpen(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>

              <h3 className="text-base font-extrabold text-on-surface mb-6">
                {selectedLessonId ? "Cập nhật bài học" : "Thêm bài học mới"}
              </h3>

              <form onSubmit={handleSaveLesson} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-semibold text-on-surface ml-1"
                    htmlFor="lTitle"
                  >
                    Tiêu đề bài học
                  </label>
                  <input
                    id="lTitle"
                    type="text"
                    required
                    className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Ví dụ: Cấu trúc cơ quan sinh dục"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface ml-1"
                      htmlFor="lType"
                    >
                      Loại bài học
                    </label>
                    <select
                      id="lType"
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      value={lessonContentType}
                      onChange={(e) =>
                        setLessonContentType(e.target.value as any)
                      }
                    >
                      <option value="HYBRID">Hỗn hợp</option>
                      <option value="VIDEO">Video</option>
                      <option value="TEXT">Văn bản thuần</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface ml-1"
                      htmlFor="lDuration"
                    >
                      Thời lượng (Phút)
                    </label>
                    <input
                      id="lDuration"
                      type="number"
                      min="1"
                      placeholder="Phút..."
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      value={lessonDuration}
                      onChange={(e) =>
                        setLessonDuration(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>

                {lessonContentType !== "TEXT" && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface ml-1"
                      htmlFor="lVideo"
                    >
                      Đường dẫn Video
                    </label>
                    <input
                      id="lVideo"
                      type="text"
                      placeholder="Dán link youtube hoặc video"
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      value={lessonVideoUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        const cleaned = extractVideoIdentifier(val);
                        if (cleaned && cleaned !== val && val.includes("http")) {
                          setLessonVideoUrl(cleaned);
                        } else {
                          setLessonVideoUrl(val);
                        }
                      }}
                    />
                  </div>
                )}

                {lessonContentType !== "VIDEO" && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface ml-1"
                      htmlFor="lBody"
                    >
                      Nội dung bài viết giảng dạy
                    </label>
                    <textarea
                      ref={lessonBodyRef}
                      id="lBody"
                      rows={6}
                      placeholder="Nhập nội dung bài học bằng văn bản/định dạng văn bản..."
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none overflow-hidden"
                      value={lessonContentBody}
                      onChange={(e) => setLessonContentBody(e.target.value)}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={lessonSubmitting}
                  className="w-full flex h-11 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 mt-2"
                >
                  {lessonSubmitting ? "Đang lưu..." : "Lưu bài giảng"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Dashboard Overview view
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-on-surface">
            Bảng Thống Kê Giảng Viên
          </h1>
          <p className="text-xs text-on-surface-variant font-light mt-1">
            Chào {user?.full_name}, vai trò quản trị hệ thống.
          </p>
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
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              menu_book
            </span>
          </div>
          <div className="text-xl font-extrabold text-on-surface">
            {loading || !stats ? (
              <div className="h-6 w-12 bg-on-surface/10 rounded animate-pulse mx-auto my-0.5" />
            ) : (
              stats.total_courses || 0
            )}
          </div>
          <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">
            Khóa học
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl text-center border border-white/60 shadow-sm space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              group
            </span>
          </div>
          <div className="text-xl font-extrabold text-on-surface">
            {loading || !stats ? (
              <div className="h-6 w-12 bg-on-surface/10 rounded animate-pulse mx-auto my-0.5" />
            ) : (
              stats.total_students_enrolled || 0
            )}
          </div>
          <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">
            Học viên
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl text-center border border-white/60 shadow-sm space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-container/10 text-secondary">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
          </div>
          <div className="text-xl font-extrabold text-on-surface">
            {loading || !stats ? (
              <div className="h-6 w-12 bg-on-surface/10 rounded animate-pulse mx-auto my-0.5" />
            ) : (
              stats.total_completed_students || 0
            )}
          </div>
          <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">
            Tốt nghiệp
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl text-center border border-white/60 shadow-sm space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-tertiary-container/10 text-tertiary">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              percent
            </span>
          </div>
          <div className="text-xl font-extrabold text-on-surface">
            {loading || !stats ? (
              <div className="h-6 w-12 bg-on-surface/10 rounded animate-pulse mx-auto my-0.5" />
            ) : (
              `${stats.average_completion_rate || 0}%`
            )}
          </div>
          <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">
            Hoàn thành TB
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl text-center border border-white/60 shadow-sm space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              description
            </span>
          </div>
          <div className="text-xl font-extrabold text-on-surface">
            {loading || !stats ? (
              <div className="h-6 w-12 bg-on-surface/10 rounded animate-pulse mx-auto my-0.5" />
            ) : (
              stats.total_lessons_published || 0
            )}
          </div>
          <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block font-bold">
            Bài giảng
          </span>
        </div>
      </div>

      {/* Courses Management Table Wrapper */}
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-sm space-y-6">
        <h3 className="text-base font-extrabold text-on-surface">
          Khóa học do tôi quản lý
        </h3>

        {loading ? (
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
                  <th className="py-4 px-4 bg-white/20">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-outline-variant/10">
                    <td className="py-4 px-4">
                      <div className="h-4 w-40 bg-on-surface/10 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-20 bg-on-surface/10 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-12 bg-on-surface/10 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-12 bg-on-surface/10 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-24 bg-on-surface/10 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-6 w-16 bg-on-surface/10 rounded-full animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-8 w-24 bg-on-surface/10 rounded-md animate-pulse" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : courses.length === 0 ? (
          <p className="text-xs text-on-surface-variant/85 py-6">
            Bạn chưa tạo khóa học nào.
          </p>
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
                  <th className="py-4 px-4 bg-white/20 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {courses.map((c) => (
                  <tr
                    key={c.course_id}
                    className="hover:bg-white/40 transition-colors"
                  >
                    <td className="py-4 px-4 font-bold text-on-surface">
                      {c.title}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase ${
                          c.target_audience === "PARENT"
                            ? "border-secondary-container/20 bg-secondary-container/10 text-secondary-container"
                            : c.target_audience === "CHILD"
                              ? "border-primary/20 bg-primary/10 text-primary"
                              : "border-tertiary/20 bg-tertiary/10 text-tertiary"
                        }`}
                      >
                        {c.target_audience === "PARENT"
                          ? "Phụ huynh"
                          : c.target_audience === "CHILD"
                            ? "Học sinh"
                            : "Cả hai"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-on-surface-variant font-medium">
                      {c.total_lessons} bài
                    </td>
                    <td className="py-4 px-4 font-bold text-on-surface">
                      {c.total_enrolled}
                    </td>
                    <td className="py-4 px-4 text-on-surface-variant">
                      <strong className="text-primary font-bold">
                        {c.completed_count}
                      </strong>{" "}
                      Hoàn thành /{" "}
                      <strong className="text-secondary font-bold">
                        {c.in_progress_count}
                      </strong>{" "}
                      Đang học
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          c.is_published
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {c.is_published ? "Public" : "Bản nháp"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSelectCourse(c.course_id)}
                        className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer shadow-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                      >
                        Quản lý
                      </button>
                      <button
                        onClick={() => handleTogglePublish(c.course_id)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer shadow-sm ${
                          c.is_published
                            ? "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                            : "bg-primary text-white hover:opacity-90"
                        }`}
                      >
                        {c.is_published ? "Hạ nháp" : "Xuất bản"}
                      </button>
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
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>

            <h3 className="text-base font-extrabold text-on-surface mb-6">
              Tạo khóa học mới
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold text-on-surface ml-1"
                  htmlFor="cTitle"
                >
                  Tiêu đề khóa học
                </label>
                <input
                  id="cTitle"
                  type="text"
                  required
                  className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Ví dụ: Giáo dục giới tính tuổi dậy thì"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold text-on-surface ml-1"
                  htmlFor="cAudience"
                >
                  Dành cho
                </label>
                <select
                  id="cAudience"
                  className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value as any)}
                >
                  <option value="BOTH">Mọi người</option>
                  <option value="CHILD">Trẻ nhỏ</option>
                  <option value="PARENT">Phụ huynh</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold text-on-surface ml-1"
                  htmlFor="cThumb"
                >
                  Link ảnh Thumbnail
                </label>
                <input
                  id="cThumb"
                  type="text"
                  className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="https://image-url.com/thumb.jpg"
                  value={newThumb}
                  onChange={(e) => setNewThumb(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold text-on-surface ml-1"
                  htmlFor="cShort"
                >
                  Tóm tắt khóa học
                </label>
                <input
                  id="cShort"
                  type="text"
                  className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Nội dung chính tóm gọn trong 1 dòng..."
                  value={newShortDesc}
                  onChange={(e) => setNewShortDesc(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold text-on-surface ml-1"
                  htmlFor="cDesc"
                >
                  Mô tả chi tiết đề cương
                </label>
                <textarea
                  ref={cDescRef}
                  id="cDesc"
                  rows={4}
                  className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none overflow-hidden"
                  placeholder="Nhập chi tiết về bài học, mục tiêu..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold text-on-surface ml-1"
                  htmlFor="cObjectives"
                >
                  Mục tiêu học tập (mỗi mục tiêu 1 dòng)
                </label>
                <textarea
                  ref={cObjectivesRef}
                  id="cObjectives"
                  rows={3}
                  className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none overflow-hidden"
                  placeholder={"- Tiếp cận các kiến thức giáo dục giới tính chuẩn y khoa\n- Rèn luyện kỹ năng tự bảo vệ bản thân và phòng chống xâm hại"}
                  value={newObjectives}
                  onChange={(e) => setNewObjectives(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-semibold text-on-surface ml-1"
                  htmlFor="cOutro"
                >
                  Lời chúc mừng hoàn thành
                </label>
                <textarea
                  ref={cOutroRef}
                  id="cOutro"
                  rows={3}
                  className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-xs text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none overflow-hidden"
                  placeholder="Nội dung sẽ hiện khi học viên tốt nghiệp khóa học..."
                  value={newOutroContent}
                  onChange={(e) => setNewOutroContent(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex h-11 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Đang tạo..." : "Tạo khóa học (Nháp)"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
