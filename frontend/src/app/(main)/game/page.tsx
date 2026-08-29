"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

interface Scenario {
  id: number;
  room_code: string;
  title: string;
  npc_name: string;
  npc_avatar_url: string;
  initial_score: number;
  target_audience: string;
  is_active: boolean;
}

interface ScenarioTheme {
  bgGradient: string;
  borderColor: string;
  badgeStyle: string;
  categoryTitle: string;
  iconName: string;
  iconColor: string;
  description: string;
}

const scenarioThemeMap: Record<string, ScenarioTheme> = {
  ROOM_STRANGER: {
    bgGradient: "from-white/90 via-red-50/30 to-white/80",
    borderColor: "border-red-200/60 hover:border-red-400/80",
    badgeStyle: "bg-red-50 text-red-600 border border-red-200/80",
    categoryTitle: "An toàn mạng",
    iconName: "security",
    iconColor: "text-red-600 bg-red-100/60",
    description:
      "Luyện kỹ năng nhận diện nguy cơ dụ dỗ, bảo vệ ranh giới cá nhân khi kẻ ẩn danh trên mạng xã hội yêu cầu hình ảnh nhạy cảm.",
  },
  ROOM_DOCTOR: {
    bgGradient: "from-white/90 via-primary-fixed/15 to-white/80",
    borderColor: "border-primary/20 hover:border-primary/50",
    badgeStyle:
      "bg-primary-fixed text-on-primary-fixed-variant border border-primary/20",
    categoryTitle: "Y khoa tuổi dậy thì",
    iconName: "medical_services",
    iconColor: "text-primary bg-primary-fixed/50",
    description:
      "Bác sĩ chuyên khoa tâm lý trực tuyến giải đáp 100% thắc mắc sinh lý thầm kín, tuổi dậy thì bằng ngôn ngữ chuẩn y khoa, cởi mở.",
  },
  ROOM_TEEN_CHILD: {
    bgGradient: "from-white/90 via-tertiary-fixed/20 to-white/80",
    borderColor: "border-tertiary/20 hover:border-tertiary/50",
    badgeStyle:
      "bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary/20",
    categoryTitle: "Tâm lý & Thấu cảm",
    iconName: "family_restroom",
    iconColor: "text-tertiary bg-tertiary-fixed/50",
    description:
      "Dành riêng cho phụ huynh đóng vai trò cha/mẹ, rèn luyện cách mở lòng đối thoại bình tĩnh, thấu cảm cùng con khi con có biểu hiện cảm nắng.",
  },
  ROOM_BULLYING: {
    bgGradient: "from-white/90 via-secondary-fixed/20 to-white/80",
    borderColor:
      "border-secondary-container/20 hover:border-secondary-container/50",
    badgeStyle:
      "bg-secondary-fixed text-on-secondary-fixed-variant border border-secondary-container/20",
    categoryTitle: "Phòng chống quấy rối",
    iconName: "favorite",
    iconColor: "text-secondary-container bg-secondary-fixed/50",
    description:
      "Đóng vai bạn tốt giúp đỡ, an ủi Linh Chi khi bạn bị trêu chọc ác ý về sự phát triển cơ thể sớm, tìm kiếm sự can thiệp từ người lớn.",
  },
};

export default function GameLandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingSessionId, setCreatingSessionId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!user) return;

    const fetchScenarios = async () => {
      try {
        const data = await api.get("/roleplay/scenarios");
        setScenarios(data);
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách kịch bản chơi");
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, [user]);

  const handleStartSession = async (scenarioId: number) => {
    try {
      setCreatingSessionId(scenarioId);
      const res = await api.post("/roleplay/sessions", {
        scenario_id: scenarioId,
      });
      router.push(`/game/${res.id}`);
    } catch (err: any) {
      alert(err.message || "Không thể khởi tạo phòng chơi");
    } finally {
      setCreatingSessionId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-surface via-surface-container-low/40 to-surface-container-high/30">
        <div className="bg-white/85 backdrop-blur-xl p-10 md:p-14 rounded-3xl border border-white/80 shadow-sm max-w-xl text-center space-y-6">
          <div className="w-16 h-16 bg-primary-fixed text-primary rounded-3xl mx-auto flex items-center justify-center shadow-sm">
            <span
              className="material-symbols-outlined text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              smart_toy
            </span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-on-surface">
              Trung tâm Mô phỏng AI Roleplay
            </h2>
            <p className="text-sm text-on-surface-variant font-light leading-relaxed">
              Bạn cần đăng nhập tài khoản học viên để tham gia luyện tập phản xạ
              và kỹ năng qua 4 phòng chơi nhập vai tương tác thông minh với AI.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={() => router.push("/login")}
              className="h-11 px-8 rounded-full bg-primary hover:opacity-90 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Đăng nhập ngay
            </button>
            <button
              onClick={() => router.push("/register")}
              className="h-11 px-8 rounded-full border border-outline/30 bg-white/50 hover:bg-white font-bold text-xs text-on-surface transition-all cursor-pointer"
            >
              Đăng ký tài khoản
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full py-12 px-4 md:px-16 bg-gradient-to-br from-surface via-surface-container-low/40 to-surface-container-high/20">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider shadow-xs">
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            smart_toy
          </span>
          Mô Phỏng Phản Xạ AI
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
          Trung Tâm Mô Phỏng
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant font-light leading-relaxed max-w-2xl mx-auto">
          Xóa bỏ rào cản e ngại trong giáo dục giới tính. Tương tác trực tiếp
          cùng các nhân vật AI giả lập chuẩn y khoa để rèn luyện kỹ năng ứng
          biến, bảo vệ bản thân và thấu hiểu ranh giới an toàn.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-on-surface-variant text-sm font-semibold animate-pulse">
            Đang tải danh sách phòng chơi...
          </p>
        </div>
      ) : error ? (
        <div className="bg-white/80 backdrop-blur-md border border-red-200 p-8 rounded-3xl text-center max-w-md mx-auto my-10 shadow-sm space-y-4">
          <span className="material-symbols-outlined text-4xl text-error">
            warning
          </span>
          <p className="text-sm text-error font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-sm cursor-pointer hover:opacity-90"
          >
            Tải lại trang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {scenarios.map((sc) => {
            const theme = scenarioThemeMap[sc.room_code] || {
              bgGradient: "from-white/90 via-surface-container/30 to-white/80",
              borderColor: "border-outline-variant/30 hover:border-primary/50",
              badgeStyle:
                "bg-surface-container text-on-surface-variant border border-outline-variant/30",
              categoryTitle: "Kịch bản AI",
              iconName: "shield",
              iconColor: "text-primary bg-primary-fixed/50",
              description: "Phòng chơi nhập vai tương tác thông minh với AI.",
            };

            const isRecommended =
              (sc.target_audience === "CHILD" &&
                user.role === "STUDENT_CHILD") ||
              (sc.target_audience === "PARENT" &&
                user.role === "STUDENT_PARENT");

            return (
              <div
                key={sc.id}
                className={`bg-gradient-to-br ${theme.bgGradient} backdrop-blur-md rounded-3xl p-8 border ${theme.borderColor} shadow-sm hover-shadow transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden`}
              >
                {/* Header in Card */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${theme.iconColor}`}
                      >
                        <span
                          className="material-symbols-outlined text-[24px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {theme.iconName}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${theme.badgeStyle}`}
                      >
                        {theme.categoryTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isRecommended && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                          Phù hợp bạn
                        </span>
                      )}
                      <span className="bg-white/80 border border-outline-variant/30 text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold">
                        {sc.target_audience === "CHILD"
                          ? "Học sinh"
                          : sc.target_audience === "PARENT"
                            ? "Phụ huynh"
                            : "Tất cả"}
                      </span>
                    </div>
                  </div>

                  {/* Titles */}
                  <h3 className="text-xl font-extrabold text-on-surface mb-3 tracking-tight group-hover:text-primary transition-colors leading-snug">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-light leading-relaxed mb-6">
                    {theme.description}
                  </p>
                </div>

                {/* Bottom segment */}
                <div className="border-t border-outline-variant/20 pt-6 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white text-primary flex items-center justify-center font-bold text-sm shadow-xs border border-outline-variant/30">
                      {sc.npc_name[0]}
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-medium">
                        Nhân vật đối thoại
                      </p>
                      <p className="text-xs font-bold text-on-surface">
                        {sc.npc_name}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={creatingSessionId !== null}
                    onClick={() => handleStartSession(sc.id)}
                    className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-primary hover:opacity-90 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {creatingSessionId === sc.id ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang mở...</span>
                      </>
                    ) : (
                      <>
                        <span>Vào chơi</span>
                        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
