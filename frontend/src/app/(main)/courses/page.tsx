"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CourseCard, CourseItem } from "@/components/CourseCard";
import { CourseCardSkeleton } from "@/components/Skeleton";

export default function CoursesPage() {
  const { user } = useAuth();
  const isParent = user?.role === "STUDENT_PARENT";
  const isChild = user?.role === "STUDENT_CHILD" || user?.role === "STUDENT";

  const initialFilter = isParent ? "PARENT" : isChild ? "CHILD" : "ALL";
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "CHILD" | "PARENT">(initialFilter);

  useEffect(() => {
    if (isParent) {
      setFilter("PARENT");
    } else if (isChild) {
      setFilter("CHILD");
    }
  }, [isParent, isChild]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "/courses";
        if (filter !== "ALL") {
          url += `?target_audience=${filter}`;
        }
        const res = await api.get(url);
        if (res.success) {
          setCourses(res.data);
        }
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải danh sách khóa học");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [filter]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-outline-variant/30 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
            {isParent
              ? "Khóa Học Cho Phụ Huynh"
              : isChild
              ? "Khóa Học Cho Học Sinh"
              : "Khóa Học"}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {isParent
              ? "Chương trình chuyên sâu giúp phụ huynh trang bị kiến thức và kỹ năng đồng hành cùng con."
              : isChild
              ? "Khám phá kiến thức giới tính và kỹ năng an toàn chuẩn y khoa dành cho học sinh."
              : "Học liệu chính thống từ đề tài nghiên cứu khoa học"}
          </p>
        </div>

        {/* Filters - Only displayed for Guests / Admins / Instructors */}
        {!isParent && !isChild && (
          <div className="flex gap-2 p-1.5 rounded-full bg-surface-container border border-outline-variant/30 shadow-inner">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === "ALL"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
              }`}
            >
              Tất cả
            </button>

            <button
              onClick={() => setFilter("CHILD")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === "CHILD"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
              }`}
            >
              Dành cho Trẻ em
            </button>

            <button
              onClick={() => setFilter("PARENT")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === "PARENT"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
              }`}
            >
              Dành cho Phụ huynh
            </button>
          </div>
        )}
      </div>

      {/* Content list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-12 border border-red-500/10 rounded-xl bg-red-950/10 max-w-md mx-auto">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center text-slate-500 py-24">
          Không tìm thấy khóa học nào phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
