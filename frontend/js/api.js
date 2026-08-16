const BASE_URL = "http://localhost:8000/api/v1";

const api = {
    getToken: () => localStorage.getItem("access_token"),
    
    saveAuth: (token, refresh, user) => {
        localStorage.setItem("access_token", token);
        if (refresh) localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user_info", JSON.stringify(user));
    },
    
    clearAuth: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_info");
    },
    
    getUserInfo: () => {
        const info = localStorage.getItem("user_info");
        return info ? JSON.parse(info) : null;
    },
    
    isAuthenticated: () => !!localStorage.getItem("access_token"),

    request: async (endpoint, options = {}) => {
        const token = api.getToken();
        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };
        
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401 && endpoint !== "/auth/login") {
                api.clearAuth();
                window.location.href = "auth.html";
            }
            throw new Error(data.detail || data.message || "Something went wrong");
        }
        
        return data;
    },
    
    get: (endpoint) => api.request(endpoint, { method: "GET" }),
    post: (endpoint, body) => api.request(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: (endpoint, body) => api.request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    delete: (endpoint) => api.request(endpoint, { method: "DELETE" }),
};

function renderNavbarAndFooter() {
    const user = api.getUserInfo();
    const isAuth = api.isAuthenticated();
    
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";

    const headerHtml = `
        <div class="container navbar-container">
            <a href="index.html" class="logo">ChiChan<span>.</span></a>
            <ul class="nav-menu">
                <li><a href="index.html" class="nav-link ${page === 'index.html' ? 'active' : ''}">Trang Chủ</a></li>
                <li><a href="courses.html" class="nav-link ${page === 'courses.html' ? 'active' : ''}">Khóa Học</a></li>
                <li><a href="forum.html" class="nav-link ${page === 'forum.html' ? 'active' : ''}">Diễn Đàn</a></li>
                <li><a href="about.html" class="nav-link ${page === 'about.html' ? 'active' : ''}">Giới Thiệu</a></li>
            </ul>
            <div class="nav-auth" style="display: flex; gap: 12px; align-items: center;">
                ${isAuth ? `
                    <a href="profile.html" class="nav-link ${page === 'profile.html' ? 'active' : ''}">Chào, ${user?.full_name || 'Học viên'}</a>
                    ${user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR' ? `
                        <a href="dashboard.html" class="nav-btn nav-btn-outline">Dashboard</a>
                    ` : ''}
                    <button onclick="handleLogout()" class="nav-btn nav-btn-outline">Đăng xuất</button>
                ` : `
                    <a href="auth.html" class="nav-btn nav-btn-primary">Đăng Nhập / Đăng Ký</a>
                `}
            </div>
        </div>
    `;
    
    const footerHtml = `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-logo-desc">
                    <a href="index.html" class="logo">ChiChan<span>.</span></a>
                    <p>Nền tảng giáo dục giới tính y khoa hàng đầu Việt Nam giúp đồng hành cùng con trẻ và phụ huynh vượt dậy thì.</p>
                </div>
                <div class="footer-col">
                    <h4>Đường dẫn nhanh</h4>
                    <ul class="footer-links">
                        <li><a href="index.html">Trang Chủ</a></li>
                        <li><a href="courses.html">Khóa Học</a></li>
                        <li><a href="forum.html">Diễn Đàn</a></li>
                        <li><a href="about.html">Giới Thiệu</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Nghiên cứu khoa học</h4>
                    <ul class="footer-links">
                        <li><a href="about.html#project">Về đề tài</a></li>
                        <li><a href="about.html#team">Nhóm nghiên cứu</a></li>
                        <li><a href="about.html#contact">Liên hệ</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 ChiChan SexEd Platform. Nghiên cứu khoa học & Phát triển.</p>
                <p>An toàn - Khoa học - Kín đáo</p>
            </div>
        </div>
    `;

    const navbarEl = document.querySelector(".navbar");
    if (navbarEl) navbarEl.innerHTML = headerHtml;
    
    const footerEl = document.querySelector(".footer");
    if (footerEl) footerEl.innerHTML = footerHtml;
}

async function handleLogout() {
    try {
        const refresh = localStorage.getItem("refresh_token");
        if (refresh) {
            await api.post("/auth/logout", { refresh_token: refresh });
        }
    } catch (e) {
        console.error("Logout error", e);
    } finally {
        api.clearAuth();
        window.location.href = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", renderNavbarAndFooter);
