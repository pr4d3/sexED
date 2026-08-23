"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
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
  category_name: string;
  author_name: string;
  comment_count: number;
  created_at: string;
}

export default function HomePage() {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PARENT" | "CHILD">("PARENT");

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

  const heroTitle =
    homeData?.hero_banner?.title || "Giáo dục Giới tính Chuẩn Khoa học";
  const heroSubtitle =
    homeData?.hero_banner?.subtitle ||
    "Môi trường học tập an toàn, thân thiện và chuẩn y khoa, giúp gỡ bỏ những rào cản và ngần ngại trong việc tiếp cận kiến thức giới tính.";

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
              {heroTitle}
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant font-light leading-relaxed max-w-lg">
              {heroSubtitle}
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

      {/* Course Switcher Section */}
      <section className="py-24 px-4 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-4">
              Lộ trình Học tập Chuyên biệt
            </h2>
            <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
              Lựa chọn chương trình phù hợp với độ tuổi và nhu cầu để có hiệu
              quả tiếp thu tốt nhất.
            </p>
          </div>

          {/* Switcher Tabs */}
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
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}/intro`}
                    className="glass-panel rounded-3xl overflow-hidden shadow-sm hover-shadow transition-all duration-300 flex flex-col h-full group bg-white/70 border border-white/50"
                  >
                    <div className="relative h-56 overflow-hidden p-2 pb-0">
                      <img
                        className="w-full h-full object-cover rounded-t-2xl group-hover:scale-[1.02] transition-transform duration-500 bg-surface-container"
                        alt={course.title}
                        src={
                          course.thumbnail_url ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500"
                        }
                      />
                      <div className="absolute top-6 left-6 px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-bold text-primary flex items-center gap-1.5 shadow-sm">
                        <span
                          className="material-symbols-outlined text-[14px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          family_restroom
                        </span>
                        {activeTab === "PARENT" ? "Phụ huynh" : "Học sinh"}
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex gap-2 mb-4">
                        <span className="px-2.5 py-0.5 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-[10px] font-bold uppercase">
                          Y khoa
                        </span>
                        <span className="px-2.5 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-[10px] font-bold uppercase">
                          Kiến thức
                        </span>
                      </div>
                      <h3 className="text-md font-bold text-on-surface mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mb-6">
                        Khóa học cung cấp lộ trình hướng dẫn chi tiết được xây
                        dựng bởi các bác sĩ và chuyên gia giàu kinh nghiệm.
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-outline-variant/20">
                        <span className="text-xs text-on-surface-variant font-medium">
                          Giảng viên:{" "}
                          <strong className="font-bold text-on-surface">
                            {course.instructor_name}
                          </strong>
                        </span>
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          {course.total_lessons} bài học
                        </span>
                      </div>
                    </div>
                  </Link>
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
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-[20px]">
                            person_outline
                          </span>
                        </div>
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
                      <h4 className="text-sm font-bold text-on-surface mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
                        Mọi người thảo luận và đưa ra lời khuyên thiết thực dưới
                        sự kiểm duyệt chuyên môn y văn.
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant pt-4 border-t border-outline-variant/20 mt-auto">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="material-symbols-outlined text-[16px]">
                          chat_bubble_outline
                        </span>
                        {post.comment_count} bình luận
                      </div>
                      <div className="flex items-center gap-1 text-xs text-primary font-bold">
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                        Đã kiểm duyệt
                      </div>
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
