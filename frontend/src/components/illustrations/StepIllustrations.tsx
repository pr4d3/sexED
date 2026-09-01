import React from "react";

// Minh họa Bước 1: Khám Phá Tri Thức Y Khoa (Phong cách Storyset / unDraw - Tông Xanh Ngọc Lục Bảo)
export function MedicalKnowledgeIllustration({ className = "w-full h-40" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Soft Glow & Shapes */}
      <circle cx="160" cy="100" r="85" fill="#E6F4EA" fillOpacity="0.7" />
      <circle cx="210" cy="65" r="35" fill="#C2E7FF" fillOpacity="0.5" />
      <circle cx="95" cy="130" r="28" fill="#FEF7E0" fillOpacity="0.8" />

      {/* Decorative Dots / Sparks */}
      <circle cx="80" cy="60" r="4" fill="#005039" fillOpacity="0.4" />
      <circle cx="245" cy="120" r="3" fill="#008272" fillOpacity="0.5" />
      <circle cx="160" cy="25" r="3.5" fill="#D97706" fillOpacity="0.5" />

      {/* Desk / Base Surface */}
      <rect x="40" y="160" width="240" height="6" rx="3" fill="#D1E7DD" />

      {/* Medical Knowledge Book (Open) */}
      <path
        d="M90 148C125 140 155 144 160 152C165 144 195 140 230 148V95C195 87 165 91 160 99C155 91 125 87 90 95V148Z"
        fill="#FFFFFF"
        stroke="#005039"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M160 99V152"
        stroke="#005039"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Book pages lines */}
      <line x1="105" y1="108" x2="145" y2="105" stroke="#005039" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.3" />
      <line x1="105" y1="118" x2="145" y2="115" stroke="#005039" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.3" />
      <line x1="105" y1="128" x2="140" y2="126" stroke="#005039" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.3" />

      <line x1="175" y1="105" x2="215" y2="108" stroke="#005039" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.3" />
      <line x1="175" y1="115" x2="215" y2="118" stroke="#005039" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.3" />
      <line x1="175" y1="126" x2="210" y2="128" stroke="#005039" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.3" />

      {/* Floating Medical Shield */}
      <g transform="translate(138, 42)">
        <path
          d="M22 0L40 7C40 22 29.5 35 22 40C14.5 35 4 22 4 7L22 0Z"
          fill="#005039"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        {/* Medical Cross inside Shield */}
        <path
          d="M22 13V27M15 20H29"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>

      {/* Floating Botanical / Science Leaf */}
      <path
        d="M235 65C235 65 248 70 250 82C250 94 238 98 238 98C238 98 240 85 235 65Z"
        fill="#34A853"
      />
      <path
        d="M80 85C80 85 68 90 66 102C66 114 78 118 78 118C78 118 76 105 80 85Z"
        fill="#008272"
      />
    </svg>
  );
}

// Minh họa Bước 2: Rèn Luyện Phản Xạ Cùng AI (Phong cách Storyset / unDraw - Tông Vàng Cam & Ngọc Bích)
export function AiSimulationIllustration({ className = "w-full h-40" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Glow */}
      <circle cx="160" cy="100" r="85" fill="#FEF3C7" fillOpacity="0.7" />
      <circle cx="110" cy="70" r="35" fill="#E6F4EA" fillOpacity="0.7" />
      <circle cx="215" cy="130" r="30" fill="#FEE2E2" fillOpacity="0.5" />

      {/* Desk Base */}
      <rect x="40" y="160" width="240" height="6" rx="3" fill="#FDE68A" />

      {/* Friendly AI Robot Character */}
      <g transform="translate(125, 60)">
        {/* Antenna */}
        <line x1="35" y1="5" x2="35" y2="16" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="35" cy="5" r="4.5" fill="#D97706" />

        {/* Head */}
        <rect x="10" y="16" width="50" height="38" rx="14" fill="#FFFFFF" stroke="#B45309" strokeWidth="2.5" />
        {/* Screen/Face */}
        <rect x="18" y="24" width="34" height="22" rx="7" fill="#005039" />
        {/* Smiling Eyes */}
        <circle cx="28" cy="34" r="2.5" fill="#34D399" />
        <circle cx="42" cy="34" r="2.5" fill="#34D399" />
        <path d="M31 40C33 42 37 42 39 40" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />

        {/* Body */}
        <rect x="14" y="58" width="42" height="32" rx="10" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
        <circle cx="35" cy="74" r="6" fill="#FFFFFF" />
        <circle cx="35" cy="74" r="3" fill="#D97706" />
      </g>

      {/* Chat Bubble Left (User's Question) */}
      <g transform="translate(45, 55)">
        <rect width="70" height="36" rx="12" fill="#FFFFFF" stroke="#005039" strokeWidth="2" />
        <line x1="14" y1="14" x2="56" y2="14" stroke="#005039" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
        <line x1="14" y1="22" x2="42" y2="22" stroke="#005039" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
        <path d="M55 36L62 44V36H55Z" fill="#FFFFFF" stroke="#005039" strokeWidth="2" />
      </g>

      {/* Chat Bubble Right (AI Safe Feedback) */}
      <g transform="translate(205, 75)">
        <rect width="75" height="40" rx="12" fill="#005039" />
        <circle cx="16" cy="20" r="5" fill="#34D399" />
        <line x1="28" y1="16" x2="62" y2="16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
        <line x1="28" y1="24" x2="52" y2="24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
        <path d="M15 40L8 47V40H15Z" fill="#005039" />
      </g>

      {/* Safe Shield Pulse Icon */}
      <circle cx="75" cy="135" r="14" fill="#E6F4EA" />
      <path d="M75 127L82 130C82 136 78 141 75 143C72 141 68 136 68 130L75 127Z" fill="#005039" />
    </svg>
  );
}

// Minh họa Bước 3: Đánh Giá & Đồng Hành Bền Vững (Phong cách Storyset / unDraw - Tông Lam Ngọc & Vàng Kim)
export function AssessmentGrowthIllustration({ className = "w-full h-40" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Soft Glow */}
      <circle cx="160" cy="100" r="85" fill="#CCFBF1" fillOpacity="0.7" />
      <circle cx="215" cy="70" r="35" fill="#FEF3C7" fillOpacity="0.7" />
      <circle cx="105" cy="125" r="30" fill="#E0F2FE" fillOpacity="0.6" />

      {/* Desk Base */}
      <rect x="40" y="160" width="240" height="6" rx="3" fill="#99F6E4" />

      {/* Big Certificate / Achievement Board */}
      <g transform="translate(100, 45)">
        <rect width="120" height="95" rx="14" fill="#FFFFFF" stroke="#008272" strokeWidth="2.5" />
        {/* Certificate Header Banner */}
        <rect x="15" y="14" width="90" height="8" rx="4" fill="#008272" />
        
        {/* Certificate Text Lines */}
        <line x1="25" y1="34" x2="95" y2="34" stroke="#008272" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />
        <line x1="30" y1="44" x2="90" y2="44" stroke="#008272" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />
        <line x1="35" y1="54" x2="85" y2="54" stroke="#008272" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />

        {/* Gold Ribbon Medal Seal */}
        <circle cx="60" cy="74" r="14" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        <path d="M55 86L52 98L60 94L68 98L65 86" fill="#D97706" />
        {/* Star inside seal */}
        <path
          d="M60 68L61.8 72.5H66.5L62.8 75.2L64.2 79.5L60 76.8L55.8 79.5L57.2 75.2L53.5 72.5H58.2L60 68Z"
          fill="#FFFFFF"
        />
      </g>

      {/* Floating Trophy & Stars Left & Right */}
      <g transform="translate(48, 80)">
        {/* Empathy Heart Badge */}
        <circle cx="20" cy="20" r="18" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />
        <path
          d="M20 26S13 21.5 13 17C13 14.5 15 13 17.5 13C18.8 13 19.8 13.8 20 14.5C20.2 13.8 21.2 13 22.5 13C25 13 27 14.5 27 17C27 21.5 20 26 20 26Z"
          fill="#EF4444"
        />
      </g>

      {/* Growth Progress Chart Mini-card Right */}
      <g transform="translate(232, 90)">
        <rect width="45" height="40" rx="8" fill="#FFFFFF" stroke="#008272" strokeWidth="1.5" />
        <line x1="8" y1="32" x2="14" y2="24" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="14" y1="24" x2="22" y2="28" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="28" x2="36" y2="12" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="36" cy="12" r="2.5" fill="#10B981" />
      </g>
    </svg>
  );
}

// Minh họa Tốt Nghiệp / Cúp Vinh Danh (Phong cách Storyset / unDraw - Đồng bộ hoàn hảo với 3 bước)
export function GraduationTrophyIllustration({ className = "w-44 h-36" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Soft Aura & Glow */}
      <circle cx="120" cy="80" r="65" fill="#FEF3C7" fillOpacity="0.75" />
      <circle cx="65" cy="55" r="28" fill="#E6F4EA" fillOpacity="0.8" />
      <circle cx="175" cy="60" r="25" fill="#CCFBF1" fillOpacity="0.8" />
      <circle cx="120" cy="30" r="18" fill="#FEF9C3" fillOpacity="0.9" />

      {/* Floating Sparkles & Confetti Dots */}
      <circle cx="45" cy="40" r="3.5" fill="#005039" fillOpacity="0.4" />
      <circle cx="195" cy="35" r="3" fill="#D97706" fillOpacity="0.6" />
      <circle cx="190" cy="95" r="4" fill="#008272" fillOpacity="0.5" />
      <circle cx="48" cy="100" r="2.5" fill="#F59E0B" fillOpacity="0.6" />

      {/* 4-point Golden Star */}
      <path
        d="M190 60L192 66L198 68L192 70L190 76L188 70L182 68L188 66L190 60Z"
        fill="#F59E0B"
      />
      <path
        d="M52 68L53.5 72.5L58 74L53.5 75.5L52 80L50.5 75.5L46 74L50.5 72.5L52 68Z"
        fill="#10B981"
      />

      {/* Ground Surface */}
      <rect x="35" y="136" width="170" height="5" rx="2.5" fill="#D1E7DD" />

      {/* Graduation Mortarboard Hat (Left Floating) */}
      <g transform="translate(42, 28) rotate(-12)">
        {/* Diamond Top */}
        <polygon points="35,10 65,2 95,10 65,18" fill="#005039" stroke="#003B2A" strokeWidth="1.5" />
        {/* Cap Base */}
        <path d="M48,14 V24 C48,29 82,29 82,24 V14" fill="#003827" />
        {/* Gold Button & Tassel */}
        <circle cx="65" cy="10" r="2.5" fill="#F59E0B" />
        <path d="M65,10 Q85,15 88,28" stroke="#D97706" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="88" cy="29" r="2.5" fill="#B45309" />
      </g>

      {/* Diploma Scroll (Right Grounded) */}
      <g transform="translate(148, 108) rotate(14)">
        <rect width="40" height="14" rx="4" fill="#FFFFFF" stroke="#008272" strokeWidth="1.8" />
        <line x1="8" y1="5" x2="32" y2="5" stroke="#008272" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="8" y1="9" x2="26" y2="9" stroke="#008272" strokeWidth="1.2" strokeOpacity="0.4" />
        {/* Red Ribbon on Diploma */}
        <rect x="18" y="-1" width="5" height="16" rx="1.5" fill="#EF4444" />
      </g>

      {/* Main Golden Trophy */}
      <g id="main-trophy">
        {/* Trophy Plinth / Pedestal Base */}
        <rect x="94" y="120" width="52" height="14" rx="4" fill="#005039" stroke="#003827" strokeWidth="1.5" />
        <rect x="100" y="123" width="40" height="4" rx="2" fill="#34D399" fillOpacity="0.4" />

        {/* Stem / Neck */}
        <path d="M110 102H130L126 120H114L110 102Z" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />

        {/* Trophy Left Handle */}
        <path
          d="M90 54C72 54 72 82 92 84"
          stroke="#B45309"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M90 54C75 54 75 80 92 82"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Trophy Right Handle */}
        <path
          d="M150 54C168 54 168 82 148 84"
          stroke="#B45309"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M150 54C165 54 165 80 148 82"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Trophy Cup Body */}
        <path
          d="M90 44H150C150 82 134 102 120 102C106 102 90 82 90 44Z"
          fill="#F59E0B"
          stroke="#B45309"
          strokeWidth="2"
        />
        {/* Cup Inner Shadow / Dimension */}
        <path
          d="M94 48H146C146 80 132 98 120 98C108 98 94 80 94 48Z"
          fill="#FBBF24"
        />

        {/* Shiny Gloss Reflection on Cup */}
        <path
          d="M98 52C98 74 106 88 114 92"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="0.85"
          fill="none"
        />

        {/* Star Medal in Center of Trophy */}
        <circle cx="120" cy="72" r="10" fill="#FFFFFF" fillOpacity="0.25" />
        <path
          d="M120 64L122.2 69H127.5L123.2 72.2L124.8 77.2L120 74.2L115.2 77.2L116.8 72.2L112.5 69H117.8L120 64Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
}

// Minh họa Giả Lập 1-1 (Phong cách Storyset / unDraw - Tông Xanh Ngọc Lục Bảo & Vàng Cam)
export function RoleplayInteractiveIllustration({ className = "w-28 h-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background Glow */}
      <circle cx="80" cy="55" r="45" fill="#E6F4EA" fillOpacity="0.75" />
      <circle cx="120" cy="35" r="18" fill="#FEF3C7" fillOpacity="0.8" />
      <circle cx="35" cy="70" r="15" fill="#C2E7FF" fillOpacity="0.6" />

      {/* Decorative Sparkles */}
      <circle cx="30" cy="30" r="2.5" fill="#005039" fillOpacity="0.4" />
      <circle cx="135" cy="75" r="2" fill="#D97706" fillOpacity="0.5" />

      {/* Student Character Head (Left) */}
      <g transform="translate(30, 38)">
        <circle cx="16" cy="14" r="12" fill="#FFFFFF" stroke="#005039" strokeWidth="2" />
        {/* Hair */}
        <path d="M6 14C6 6 12 4 18 4C24 4 28 8 28 14" fill="#005039" />
        {/* Smile */}
        <path d="M13 18C15 20 17 20 19 18" stroke="#005039" strokeWidth="1.5" strokeLinecap="round" />
        {/* Body Base */}
        <path d="M4 34C4 28 10 26 16 26C22 26 28 28 28 34" fill="#34A853" />
      </g>

      {/* AI Bot Character (Right) */}
      <g transform="translate(95, 36)">
        {/* Antenna */}
        <line x1="18" y1="2" x2="18" y2="8" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="2" r="2.5" fill="#F59E0B" />
        {/* Head */}
        <rect x="4" y="8" width="28" height="22" rx="8" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
        {/* Screen */}
        <rect x="8" y="12" width="20" height="13" rx="4" fill="#005039" />
        <circle cx="14" cy="18" r="1.5" fill="#34D399" />
        <circle cx="22" cy="18" r="1.5" fill="#34D399" />
        {/* Body */}
        <rect x="7" y="31" width="22" height="14" rx="5" fill="#F59E0B" />
      </g>

      {/* Interactive Lightning Speed Bubble (Center) */}
      <g transform="translate(68, 22)">
        <circle cx="12" cy="12" r="12" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
        {/* Lightning Bolt */}
        <path d="M13 4L8 13H13L11 20L17 11H12L13 4Z" fill="#FFFFFF" />
      </g>

      {/* Chat wave line */}
      <path d="M56 50Q68 45 80 50Q92 55 104 50" stroke="#005039" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.4" />
    </svg>
  );
}

// Minh họa Chuẩn Y Văn & Ranh Giới (Phong cách Storyset / unDraw - Tông Lam Ngọc & Xanh Lá)
export function MedicalBoundaryIllustration({ className = "w-28 h-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background Glow */}
      <circle cx="80" cy="55" r="45" fill="#CCFBF1" fillOpacity="0.75" />
      <circle cx="125" cy="40" r="16" fill="#E0F2FE" fillOpacity="0.8" />
      <circle cx="35" cy="65" r="14" fill="#FEF3C7" fillOpacity="0.7" />

      {/* Sparkles */}
      <circle cx="130" cy="75" r="2" fill="#008272" fillOpacity="0.5" />
      <circle cx="30" cy="35" r="2.5" fill="#10B981" fillOpacity="0.4" />

      {/* Medical Safety Shield (Center) */}
      <g transform="translate(56, 20)">
        <path
          d="M24 2L44 9C44 26 32 42 24 48C16 42 4 26 4 9L24 2Z"
          fill="#008272"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        {/* Inner Shield Layer */}
        <path
          d="M24 7L39 12C39 26 29 39 24 43C19 39 9 26 9 12L24 7Z"
          fill="#005039"
        />
        {/* Medical Cross */}
        <path
          d="M24 16V34M15 25H33"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* 100% Score Pill Badge Left */}
      <g transform="translate(18, 55)">
        <rect width="40" height="20" rx="8" fill="#FFFFFF" stroke="#008272" strokeWidth="1.5" />
        <text x="20" y="14" textAnchor="middle" fill="#008272" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          100%
        </text>
      </g>

      {/* Stethoscope Loop Right */}
      <g transform="translate(108, 45)">
        <path d="M6 10C6 24 26 24 26 10" stroke="#008272" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="16" cy="32" r="5" fill="#008272" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="16" y1="23" x2="16" y2="28" stroke="#008272" strokeWidth="2" />
      </g>
    </svg>
  );
}

// Minh họa 100% Ẩn Danh & An Toàn (Phong cách Storyset / unDraw - Tông Xanh Sapphire & Tím Nhạt)
export function AnonymousSafeIllustration({ className = "w-28 h-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background Glow */}
      <circle cx="80" cy="55" r="45" fill="#E0F2FE" fillOpacity="0.8" />
      <circle cx="120" cy="65" r="18" fill="#F3E8FF" fillOpacity="0.7" />
      <circle cx="40" cy="35" r="16" fill="#CCFBF1" fillOpacity="0.7" />

      {/* Decorative Sparkles */}
      <circle cx="130" cy="30" r="2.5" fill="#2563EB" fillOpacity="0.4" />
      <circle cx="30" cy="75" r="2" fill="#7C3AED" fillOpacity="0.4" />

      {/* Chat Bubble Box with Padlock (Center) */}
      <g transform="translate(48, 24)">
        {/* Chat Bubble Base */}
        <rect width="64" height="46" rx="14" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
        <path d="M22 46L16 54V46H22Z" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />

        {/* Lock Shackle */}
        <path
          d="M26 20V14C26 10.7 28.7 8 32 8C35.3 8 38 10.7 38 14V20"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Lock Body */}
        <rect x="22" y="19" width="20" height="16" rx="5" fill="#2563EB" />
        {/* Keyhole */}
        <circle cx="32" cy="26" r="2" fill="#FFFFFF" />
        <path d="M32 27V31" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Empathy Heart Floating Right */}
      <g transform="translate(112, 32)">
        <circle cx="14" cy="14" r="12" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.2" />
        <path
          d="M14 18S9 14.8 9 11.5C9 9.8 10.3 8.5 12 8.5C12.9 8.5 13.6 9 14 9.6C14.4 9 15.1 8.5 16 8.5C17.7 8.5 19 9.8 19 11.5C19 14.8 14 18 14 18Z"
          fill="#EF4444"
        />
      </g>

      {/* Safe Checkmark Shield Floating Left */}
      <g transform="translate(18, 40)">
        <circle cx="12" cy="12" r="10" fill="#E6F4EA" stroke="#10B981" strokeWidth="1.2" />
        <path d="M8 12L11 15L16 9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}


