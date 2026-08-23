"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";

interface Author {
  name: string;
  role: string;
  contact: string;
  institution?: string; // Optional field if present in DB
  avatar?: string; // Optional field if present in DB
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Feedback form state
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const feedbackContentRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (feedbackContentRef.current) {
      feedbackContentRef.current.style.height = "auto";
      if (feedbackContent) {
        feedbackContentRef.current.style.height = `${feedbackContentRef.current.scrollHeight}px`;
      }
    }
  }, [feedbackContent]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await api.get("/general/about-us");
        if (res.success) {
          setAboutData(res.data);
        }
      } catch (err) {
        console.error("Error loading about page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const title =
    aboutData?.research_title ||
    "Ứng dụng E-learning trong Phổ cập Giáo dục Giới tính tại Việt Nam";
  const purpose =
    aboutData?.research_purpose ||
    "Thực trạng thiếu hụt kiến thức giáo dục giới tính toàn diện và khoa học tại Việt Nam đang dẫn đến nhiều hệ lụy xã hội. Nhu cầu cấp thiết là một nền tảng giáo dục chuẩn y khoa, an toàn và dễ tiếp cận, nhằm trang bị kiến thức bảo vệ bản thân cho thanh thiếu niên, xóa bỏ các rào cản tâm lý và định kiến sai lệch.";
  const methodology =
    aboutData?.methodology ||
    "Khung chương trình được cá nhân hóa sâu sắc, xây dựng dựa trên sự phát triển sinh lý và tâm lý của từng giai đoạn tuổi tác. Tích hợp E-learning với thiết kế trực quan, gamification để tăng tính tương tác, đồng thời đảm bảo nội dung phù hợp với văn hóa và chuẩn mực y tế, mang lại môi trường học tập an toàn tuyệt đối.";

  // Default fallback profiles matching the updated design if database returns empty
  const authors: Author[] = aboutData?.authors || [
    {
      name: "TS. BS. Nguyễn Trí Minh",
      role: "Trưởng nhóm Nghiên cứu",
      contact: "minh.nt@edusex.vn",
      institution: "Viện Sức khỏe Sinh sản Quốc gia",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAHXhwkCj6-K2T_qXFsBMvKLy6oX4BejV11uV_80ulB-FoLaX52_GQC1ByDcocmKQJd0ifwEgoBV2CE9thIQkHo7X-qvKjw4ZDBb4W31kNPFW3jN1LyYtABDnleeaMBMwe1q1dPvn9Uj7sxF0HHDmdIHX0HJU3450yunmav_JaL5KW3RkvkfxcCblSn2gT6YGb42fx_ZEA7N-Tc2Wk_ipiKrtJ_pjuq2z5kQNT8fgnrtxs04CYn0aTlmw",
    },
    {
      name: "ThS. Lê Hoàng Lan",
      role: "Chuyên gia Tâm lý học",
      contact: "lan.lh@edusex.vn",
      institution: "Đại học Khoa học Xã hội & Nhân văn",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBPGBNFNfcDzBSGThs5V8acdoOxO79Ukgp1N_XlB88eeOrHFPbW3YPmtvPk_WwK1-AyoSQ5NFqrXjYec2ukQRMw8tOKG-jY2onXCugNH8tZkkbvOHsiovY9yi7a9eXkreUqL32Y0vDx1h-oqPDlaFWhtxND7R9uFv_RTdwftBFN_QpxkohqC2WxrSXBhcZg10l9lueHmMI67CKjrkG7VzJfMc68jqwJQvdkbGRpy2uW_oGJayjYBUcmEw",
    },
    {
      name: "ThS. Trần Quang Huy",
      role: "Thiết kế E-learning",
      contact: "huy.tq@edusex.vn",
      institution: "Đại học Bách Khoa Hà Nội",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB47FgwTKVDEcgZiRqOMPCFyGxrIGR3b1PMXFegG61Dbuw4oAPS_z2Z7_Ep_9Jzy2WZqBCvVmFOdysU1Hxy3UI8T9TrDSk5Yy1-Ie-DAQw7N4EUEY718-weZIBvkwn_7TdDKgQYM05-K86M2XZnZQbxv720XNSDV30dMJtimYjLwtr5s3aS4JoF7XXzycYYuCZwUK_uNkmXRG0uUYRlxuW-cUQsVl6ojWV6w3I4rUACyFL58cCokot5IA",
    },
    {
      name: "BSCKII. Phạm Bích Ngọc",
      role: "Cố vấn Y khoa",
      contact: "ngoc.pb@edusex.vn",
      institution: "Bệnh viện Nhi Đồng",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBkceBbg39Ysh5rhkbxBpKQ6jadTSEt8cGKBe6MAFk52qYpoa9c7dT8nE3ND4o66aEi1A-EFdHbcodpqlLd832jELwnX2gF_p30eJ1B9m6c6OYysdqrG5rLJPzNCOJRV-lFhvLr4yXIwCtQGDuOC6xRwEZeocq4QVxodiixUZ8aKXhropJgOJnfXAJ9X0-bfJQ7BD_sMMImMkEYJRkct7a746mmQWGWpxM4_i21PaeeKBGifkRkvVvBNA",
    },
  ];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackName && feedbackEmail && feedbackContent) {
      setFeedbackSent(true);
      setFeedbackName("");
      setFeedbackEmail("");
      setFeedbackContent("");
      setTimeout(() => {
        setFeedbackSent(false);
      }, 3000);
    }
  };

  return (
    <main className="flex-grow flex flex-col relative w-full">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-secondary-container/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Banner */}
      <section className="relative w-full py-16 px-4 md:px-16 flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary-container mb-6 leading-tight">
            Đề tài Nghiên cứu Khoa học
          </h1>
          <p className="text-lg md:text-xl font-medium text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            {title}
          </p>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-16 text-on-surface-variant text-sm font-semibold">
          Đang tải thông tin đề tài...
        </div>
      ) : (
        <>
          {/* Section 1: Cấp thiết & Phương pháp */}
          <section className="py-12 px-4 md:px-16 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card 1: Tính cấp thiết */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-sm hover-shadow transition-all duration-300 border border-white/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-error-container/40 to-transparent rounded-bl-[100px] -z-10 transition-transform group-hover:scale-105 duration-500"></div>
                <div className="w-14 h-14 bg-gradient-to-br from-error-container to-white text-error rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-error-container/50">
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    warning
                  </span>
                </div>
                <h2 className="text-xl font-bold text-on-surface mb-4">
                  Tính cấp thiết của Đề tài
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                  {purpose}
                </p>
              </div>
              {/* Card 2: Phương pháp */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-sm hover-shadow transition-all duration-300 border border-white/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-tertiary-fixed/40 to-transparent rounded-bl-[100px] -z-10 transition-transform group-hover:scale-105 duration-500"></div>
                <div className="w-14 h-14 bg-gradient-to-br from-tertiary-fixed to-white text-tertiary-container rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-tertiary-fixed/50">
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    psychology
                  </span>
                </div>
                <h2 className="text-xl font-bold text-on-surface mb-4">
                  Phương pháp tiếp cận theo lứa tuổi
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                  {methodology}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Đội ngũ Nghiên cứu */}
          <section className="py-20 px-4 md:px-16 w-full relative bg-surface-container-low/40">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface">
                  Đội ngũ Nghiên cứu &amp; Cố vấn
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Những thành viên tâm huyết đằng sau dự án
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {authors.map((author, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-white/60 relative overflow-hidden group hover:-translate-y-1"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-container to-secondary-container opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-28 h-28 mx-auto rounded-full overflow-hidden mb-6 border-4 border-surface-container shadow-sm group-hover:border-primary-container/20 transition-colors duration-300">
                      {author.avatar ? (
                        <img
                          alt={author.name}
                          className="w-full h-full object-cover"
                          src={author.avatar}
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[48px]">
                            person
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-on-surface mb-1">
                      {author.name}
                    </h3>
                    <p className="text-[10px] font-bold text-secondary-container mb-2 uppercase tracking-wider">
                      {author.role}
                    </p>
                    <p className="text-xs text-on-surface-variant font-light mb-4">
                      {author.institution || author.contact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Feedback Form & Contact */}
          <section className="py-20 px-4 md:px-16 max-w-5xl mx-auto w-full">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-sm relative overflow-hidden border border-white/50">
              {/* Decorative subtle elements */}
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-bl from-primary-fixed to-secondary-fixed rounded-full blur-[80px] opacity-60"></div>
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-secondary-fixed to-primary-fixed rounded-full blur-[80px] opacity-40"></div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                {/* Contact Info */}
                <div className="space-y-6">
                  <h2 className="text-xl md:text-2xl font-extrabold text-on-surface">
                    Liên hệ &amp; Đóng góp
                  </h2>
                  <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                    Dự án nghiên cứu của chúng tôi luôn mở rộng cửa đón nhận
                    những ý kiến đóng góp từ cộng đồng, phụ huynh, giáo viên và
                    các chuyên gia y tế để hoàn thiện hơn nữa hệ thống
                    E-learning.
                  </p>
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center space-x-4 group">
                      <div className="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">
                          mail
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                          Email
                        </p>
                        <p className="text-sm font-semibold text-on-surface">
                          example@domain.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 group">
                      <div className="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">
                          call
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                          Hotline
                        </p>
                        <p className="text-sm font-semibold text-on-surface">
                          1900 xxxx
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 group">
                      <div className="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">
                          location_on
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                          Địa chỉ
                        </p>
                        <p className="text-sm font-semibold text-on-surface">
                          TRƯỜNG THPT GIỒNG ÔNG TỐ
                          <br />
                          200/10 Nguyễn Thị Định,
                          <br />
                          Phường Bình Trưng,
                          <br />
                          Thành phố Hồ Chí Minh
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Form */}
                <form
                  onSubmit={handleSendFeedback}
                  className="space-y-5 bg-white/40 p-6 rounded-2xl border border-white/60 shadow-inner backdrop-blur-sm"
                >
                  {feedbackSent && (
                    <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3 text-xs font-semibold text-primary">
                      Cảm ơn bạn đã đóng góp ý kiến cho đội ngũ nghiên cứu!
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      Bạn tên gì
                    </label>
                    <input
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      required
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary shadow-inner transition-all outline-none"
                      placeholder="Nhập họ và tên của bạn"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      Email
                    </label>
                    <input
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      required
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary shadow-inner transition-all outline-none"
                      placeholder="Nhập địa chỉ email"
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      Nội dung đóng góp
                    </label>
                    <textarea
                      ref={feedbackContentRef}
                      value={feedbackContent}
                      onChange={(e) => setFeedbackContent(e.target.value)}
                      required
                      className="w-full bg-white/50 border border-white/60 rounded-2xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary shadow-inner transition-all outline-none resize-none overflow-hidden"
                      placeholder="Chia sẻ ý kiến của bạn..."
                      rows={4}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md hover:shadow-lg hover:opacity-95"
                  >
                    Gửi phản hồi
                  </button>
                </form>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
