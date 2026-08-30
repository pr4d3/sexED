"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CourseCard } from "@/components/CourseCard";
import { CourseCardSkeleton, ForumPostSkeleton } from "@/components/Skeleton";

interface Course {
  id: string;
  title: string;
  thumbnail_url: string | null;
  instructor_name: string;
  total_lessons: number;
}

interface ForumPost {
  id: string;
  title: string;
  short_content?: string | null;
  category_name: string;
  author_name: string;
  author_avatar?: string | null;
  is_anonymous?: boolean;
  likes_count?: number;
  comment_count: number;
  created_at: string;
}

export default function HomePage() {
  const { user } = useAuth();
  const isParent = user?.role === "STUDENT_PARENT";
  const isChild = user?.role === "STUDENT_CHILD" || user?.role === "STUDENT";

  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PARENT" | "CHILD">(
    isChild ? "CHILD" : "PARENT"
  );

  useEffect(() => {
    if (isParent) {
      setActiveTab("PARENT");
    } else if (isChild) {
      setActiveTab("CHILD");
    }
  }, [isParent, isChild]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await api.get("/general/home");
        if (res.success) {
          setHomeData(res.data);
        }
      } catch (err) {
        console.error("Error loading home page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);


  const coursesToRender =
    activeTab === "PARENT"
      ? homeData?.parent_courses || []
      : homeData?.child_courses || [];

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-4 md:px-16 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-surface-container-highest/50 to-transparent rounded-bl-[100px] -z-10"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-fixed text-on-primary-fixed-variant rounded-full w-fit shadow-sm">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <span className="text-xs font-semibold">
                Được kiểm định bởi Chuyên gia Y tế
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
              Nền tảng Giáo dục Giới tính Trực tuyến An toàn &amp; Khoa học
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant font-light leading-relaxed max-w-lg">
              Môi trường học tập an toàn, thân thiện và chuẩn y khoa, giúp gỡ bỏ những rào cản và ngần ngại trong việc tiếp cận kiến thức giới tính.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/courses"
                className="px-6 py-3.5 bg-primary text-white rounded-full text-sm font-bold hover:opacity-90 shadow-md flex items-center justify-center gap-2 transition-all"
              >
                Khám phá Khóa học
                <span className="material-symbols-outlined text-white text-[18px]">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/about"
                className="px-6 py-3.5 border border-outline/30 text-primary hover:bg-surface-container rounded-full text-sm font-bold flex items-center justify-center transition-all"
              >
                Tìm hiểu Đề tài
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] sm:h-[400px] md:h-[480px] rounded-3xl overflow-hidden soft-shadow bg-surface-container-low border border-white/60">
            <img
              className="w-full h-full object-cover"
              alt="Family education illustration"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7c-50E7YciWS32aSB6rVFgMfVSMttHvTjxu5JO3zk2MrR7VbM1gqCXqqBpytxqleb_hu024W0117UgQog1MJnf3ZUF4kOtwY2uXud8XMf-kadZjCJ7993kLihuSijyp9VMurEoBD8S_uWOM3F-mElDXBLNTx36V2dXBSXpViLNrD5NasVKuLsJ7krEDcZ92m7tlaTyFm-yKuV7DlPcrTgpNq1YGK7Loi0DztgxfMYfKoXDLgFhBDEXA"
            />
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="py-16 px-4 md:px-16 bg-surface-container-low/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm hover-shadow transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-fixed to-primary-fixed-dim rounded-2xl flex items-center justify-center mb-6 text-on-primary-fixed shadow-inner">
                <span
                  className="material-symbols-outlined text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  shield
                </span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-on-surface">
                Chuẩn Y khoa
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Nội dung được thẩm định bởi các bác sĩ và chuyên gia tâm lý hàng
                đầu, đảm bảo tính chính xác và an toàn tuyệt đối.
              </p>
            </div>
            {/* Pillar 2 */}
            <div className="flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm hover-shadow transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary-fixed to-secondary-fixed-dim rounded-2xl flex items-center justify-center mb-6 text-on-secondary-fixed shadow-inner">
                <span
                  className="material-symbols-outlined text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-on-surface">
                Thân thiện
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Cách tiếp cận mềm mại, loại bỏ cảm giác ngần ngại, giúp người
                học dễ dàng tiếp thu những chủ đề nhạy cảm.
              </p>
            </div>
            {/* Pillar 3 */}
            <div className="flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm hover-shadow transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-tertiary-fixed to-tertiary-fixed-dim rounded-2xl flex items-center justify-center mb-6 text-on-tertiary-fixed shadow-inner">
                <span
                  className="material-symbols-outlined text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  forum
                </span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-on-surface">
                Cộng đồng An toàn
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Môi trường thảo luận kín đáo, được kiểm duyệt nghiêm ngặt để bảo
                vệ sự riêng tư và tôn trọng cá nhân.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured AI Roleplay Simulation Hub Section */}
      <section className="py-20 px-4 md:px-16 relative overflow-hidden bg-gradient-to-b from-transparent via-primary-container/10 to-transparent">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-fixed text-on-primary-fixed-variant rounded-full w-fit shadow-sm">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  smart_toy
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Mô phỏng Phản xạ AI
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                Phòng Chơi Tương Tác &amp; Giả Lập Tình Huống
              </h2>
              <p className="text-sm md:text-base text-on-surface-variant font-light max-w-2xl leading-relaxed">
                Rèn luyện kỹ năng thực tế với hệ thống AI Roleplay được trang bị
                tri thức y văn (RAG). Nhận phản hồi cảm xúc chân thật, tính điểm
                an toàn và đánh giá năng lực khoa học tức thì.
              </p>
            </div>
            <Link
              href="/game"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-xs font-bold hover:opacity-90 shadow-md transition-all self-start md:self-auto shrink-0"
            >
              Khám phá Tất cả Phòng chơi
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* 4 Featured AI Roleplay Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Room 1 */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm hover-shadow transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200/80 text-[10px] font-extrabold uppercase tracking-wider">
                    An toàn mạng
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Trực tuyến
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                    alt="Quân Kool"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      Quân Kool
                    </h3>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      Bạn quen qua mạng xã hội
                    </p>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-on-surface line-clamp-1">
                  Kẻ ẩn danh &amp; Ranh giới an toàn
                </h4>
                <p className="text-xs text-on-surface-variant font-light leading-relaxed line-clamp-3">
                  Ứng biến khi đối mặt với những lời mời riêng tư, gạ gẫm gửi
                  hình ảnh nhạy cảm và bảo vệ quyền riêng tư cá nhân.
                </p>
              </div>
              <Link
                href="/game"
                className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold text-primary group-hover:underline"
              >
                <span>Vào thử thách</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Room 2 */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm hover-shadow transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-extrabold uppercase tracking-wider">
                    Y khoa tuổi dậy thì
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Trực tuyến
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1594824813501-4475e0a298a0?w=150"
                    alt="BS. Minh Trang"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      BS. Minh Trang
                    </h3>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      Bác sĩ tư vấn sức khỏe
                    </p>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-on-surface line-clamp-1">
                  Anh/Chị Cố vấn dậy thì
                </h4>
                <p className="text-xs text-on-surface-variant font-light leading-relaxed line-clamp-3">
                  Không gian riêng tư, thân thiện và chuẩn y khoa để giải đáp
                  những băn khoăn thầm kín về sinh lý và tâm lý.
                </p>
              </div>
              <Link
                href="/game"
                className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold text-primary group-hover:underline"
              >
                <span>Vào thử thách</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Room 3 */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm hover-shadow transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-extrabold uppercase tracking-wider">
                    Tâm lý &amp; Thấu cảm
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Trực tuyến
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
                    alt="Bảo Khang"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      Bảo Khang (15 tuổi)
                    </h3>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      Học sinh lớp 9
                    </p>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-on-surface line-clamp-1">
                  Đổi vai thấu hiểu: Con cái &amp; Cha mẹ
                </h4>
                <p className="text-xs text-on-surface-variant font-light leading-relaxed line-clamp-3">
                  Trải nghiệm góc nhìn của phụ huynh khi con có biểu hiện cảm
                  nắng hoặc đóng kín cửa phòng để xây dựng đối thoại tích cực.
                </p>
              </div>
              <Link
                href="/game"
                className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold text-primary group-hover:underline"
              >
                <span>Vào thử thách</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Room 4 */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm hover-shadow transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-extrabold uppercase tracking-wider">
                    Phòng chống quấy rối
                  </span>
                  <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Trực tuyến
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"
                    alt="Linh Chi"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      Linh Chi
                    </h3>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      Bạn cùng trường
                    </p>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-on-surface line-clamp-1">
                  Giải cứu tình huống học đường
                </h4>
                <p className="text-xs text-on-surface-variant font-light leading-relaxed line-clamp-3">
                  Hỗ trợ bạn bè khi bị tung tin đồn hoặc đụng chạm không an
                  toàn, tìm kiếm sự can thiệp đúng đắn từ thầy cô và người lớn.
                </p>
              </div>
              <Link
                href="/game"
                className="mt-6 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs font-bold text-primary group-hover:underline"
              >
                <span>Vào thử thách</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* Highlights Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-xs">
              <span className="material-symbols-outlined text-primary text-[24px]">
                bolt
              </span>
              <div>
                <h4 className="text-xs font-bold text-on-surface">
                  Truyền phát Real-time (SSE)
                </h4>
                <p className="text-[11px] text-on-surface-variant font-light">
                  Phản hồi mượt mà từng từ kèm biểu cảm NPC
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-xs">
              <span className="material-symbols-outlined text-primary text-[24px]">
                menu_book
              </span>
              <div>
                <h4 className="text-xs font-bold text-on-surface">
                  RAG Vector Y Văn Chuẩn
                </h4>
                <p className="text-[11px] text-on-surface-variant font-light">
                  Tích hợp giáo trình y khoa đối chiếu liên tục
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-xs">
              <span className="material-symbols-outlined text-primary text-[24px]">
                analytics
              </span>
              <div>
                <h4 className="text-xs font-bold text-on-surface">
                  Đánh Giá Khoa Học Tức Thì
                </h4>
                <p className="text-[11px] text-on-surface-variant font-light">
                  Chấm điểm an toàn &amp; phân tích tâm lý sau mỗi ván
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Switcher Section */}
      <section className="py-24 px-4 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-4">
              {isParent
                ? "Lộ trình Học tập Dành cho Phụ huynh"
                : isChild
                ? "Lộ trình Học tập Dành cho Học sinh"
                : "Lộ trình Học tập Chuyên biệt"}
            </h2>
            <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
              {isParent
                ? "Chương trình hướng dẫn chuyên sâu giúp phụ huynh trang bị kiến thức y khoa và kỹ năng đồng hành cùng con."
                : isChild
                ? "Khám phá kiến thức cơ thể, giới tính và các kỹ năng phòng tránh xâm hại an toàn chuẩn khoa học."
                : "Lựa chọn chương trình phù hợp với độ tuổi và nhu cầu để có hiệu quả tiếp thu tốt nhất."}
            </p>
          </div>

          {/* Switcher Tabs - Only visible for Guests / Admin / Instructors */}
          {!isParent && !isChild && (
            <div className="inline-flex p-1.5 bg-surface-container-high rounded-full mb-16 shadow-inner border border-outline-variant/20">
              <button
                onClick={() => setActiveTab("PARENT")}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "PARENT"
                    ? "bg-white text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Dành cho Phụ huynh
              </button>
              <button
                onClick={() => setActiveTab("CHILD")}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "CHILD"
                    ? "bg-white text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Dành cho Trẻ nhỏ
              </button>
            </div>
          )}

          {/* Course Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {Array.from({ length: 3 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {coursesToRender.length === 0 ? (
                <div className="col-span-full text-center py-12 text-on-surface-variant/75 text-sm">
                  Chưa có khóa học nổi bật nào.
                </div>
              ) : (
                coursesToRender.map((course: Course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    forcedAudience={activeTab}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Recent Forum Feed */}
      <section className="py-24 bg-surface-container-low/30 px-4 md:px-16 relative border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-2">
                Thảo luận Cộng đồng
              </h2>
              <p className="text-sm text-on-surface-variant">
                Không gian chia sẻ kiến thức cho phụ huynh và trẻ em.
              </p>
            </div>
            <Link
              className="hidden md:flex items-center gap-1 text-primary hover:text-primary-container font-semibold transition-colors text-sm"
              href="/forum"
            >
              Xem tất cả{" "}
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <ForumPostSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!homeData?.recent_forum_posts ||
              homeData.recent_forum_posts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-on-surface-variant/75 text-sm">
                  Chưa có chủ đề thảo luận nào.
                </div>
              ) : (
                homeData.recent_forum_posts.map((post: ForumPost) => (
                  <Link
                    key={post.id}
                    href={`/forum/${post.id}`}
                    className="p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm hover-shadow transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3">
                          {post.is_anonymous ? (
                            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant flex-shrink-0">
                              <span className="material-symbols-outlined text-[20px]">
                                person_off
                              </span>
                            </div>
                          ) : post.author_avatar ? (
                            <img
                              src={post.author_avatar}
                              alt={post.author_name}
                              className="w-10 h-10 rounded-full object-cover border border-outline-variant/30 shadow-xs flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                              {post.author_name ? post.author_name.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-on-surface">
                              {post.author_name || "Thành viên ẩn danh"}
                            </p>
                            <p className="text-[10px] text-on-surface-variant">
                              {new Date(post.created_at).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-[10px] font-semibold text-on-surface-variant border border-outline-variant/20 flex-shrink-0">
                          {post.category_name}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-on-surface mb-2.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
                        {post.short_content || "Bấm vào để xem nội dung thảo luận và các ý kiến đóng góp từ cộng đồng."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-on-surface-variant pt-4 border-t border-outline-variant/20 mt-auto">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">
                            chat_bubble_outline
                          </span>
                          {post.comment_count} bình luận
                        </div>
                        {post.likes_count !== undefined && post.likes_count > 0 && (
                          <div className="flex items-center gap-1 text-red-500">
                            <span className="material-symbols-outlined text-[16px]">
                              favorite
                            </span>
                            {post.likes_count}
                          </div>
                        )}
                      </div>

                      <span className="text-xs text-primary font-bold group-hover:translate-x-0.5 transition-transform">
                        Xem chi tiết →
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link
              href="/forum"
              className="inline-flex px-8 py-3 border border-outline/30 text-on-surface rounded-full text-sm font-bold bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white/80 transition-colors"
            >
              Xem tất cả thảo luận
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
