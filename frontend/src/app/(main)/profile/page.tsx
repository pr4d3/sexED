'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { User, BookOpen, Settings, CheckCircle2 } from 'lucide-react';

interface EnrolledCourse {
    course_id: string;
    course_title: string;
    thumbnail_url: string | null;
    status: 'IN_PROGRESS' | 'COMPLETED';
    total_lessons: number;
    completed_lessons: number;
    progress_percentage: number;
    enrolled_at: string;
    completed_at: string | null;
}

export default function ProfilePage() {
    const { user, updateUserLocal } = useAuth();

    const [activeTab, setActiveTab] = useState<'progress' | 'settings'>('progress');
    const [profileLoading, setProfileLoading] = useState(true);
    const [myCourses, setMyCourses] = useState<EnrolledCourse[]>([]);
    const [coursesLoading, setCoursesLoading] = useState(false);

    // Form states
    const [fullName, setFullName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [bio, setBio] = useState('');
    const [updating, setUpdating] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                if (res.success) {
                    const u = res.data;
                    setFullName(u.full_name || '');
                    setGender(u.gender || '');
                    setDob(u.date_of_birth || '');
                    setPhone(u.phone_number || '');
                    setAvatarUrl(u.avatar_url || '');
                    setBio(u.bio || '');

                    if (u.role === 'STUDENT_PARENT' || u.role === 'STUDENT_CHILD') {
                        setActiveTab('progress');
                        fetchMyCourses();
                    } else {
                        setActiveTab('settings');
                    }
                }
            } catch (err) {
                console.error("Error loading profile", err);
            } finally {
                setProfileLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const fetchMyCourses = async () => {
        setCoursesLoading(true);
        try {
            const res = await api.get('/users/my-courses');
            if (res.success) {
                setMyCourses(res.data);
            }
        } catch (err) {
            console.error("Error loading my courses", err);
        } finally {
            setCoursesLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);
        setUpdating(true);

        try {
            const res = await api.put('/users/profile', {
                full_name: fullName,
                gender: gender || null,
                date_of_birth: dob || null,
                phone_number: phone || null,
                avatar_url: avatarUrl || null,
                bio: bio || null,
            });

            if (res.success) {
                setMsg({ type: 'success', text: 'Cập nhật hồ sơ cá nhân thành công!' });
                updateUserLocal({ full_name: fullName });
            }
        } catch (err: any) {
            setMsg({ type: 'error', text: err.message || 'Lỗi khi cập nhật hồ sơ' });
        } finally {
            setUpdating(false);
        }
    };

    if (profileLoading) {
        return <div className="text-center py-24 text-slate-400">Đang tải thông tin tài khoản...</div>;
    }

    const isStudent = user?.role === 'STUDENT_PARENT' || user?.role === 'STUDENT_CHILD';

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Side: Avatar and role widget */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl text-center space-y-4">
                        <div className="relative mx-auto h-28 w-28 rounded-full overflow-hidden border-2 border-primary bg-slate-950">
                            <img
                                src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                                alt="User Avatar"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-tight">{fullName}</h3>
                            <span className="inline-flex mt-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                {user?.role === 'ADMIN'
                                    ? 'Quản trị viên'
                                    : user?.role === 'INSTRUCTOR'
                                    ? 'Giảng viên'
                                    : user?.role === 'STUDENT_PARENT'
                                    ? 'Phụ huynh'
                                    : 'Học sinh'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">
                            {bio || 'Chưa thiết lập tiểu sử.'}
                        </p>
                    </div>

                    {/* Navigation Tab Menu */}
                    <div className="glass-panel p-2 rounded-xl flex flex-col space-y-1">
                        {isStudent && (
                            <button
                                onClick={() => setActiveTab('progress')}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                                    activeTab === 'progress' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <BookOpen className="h-4.5 w-4.5" />
                                Tiến độ học tập
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === 'settings' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Settings className="h-4.5 w-4.5" />
                            Thông tin tài khoản
                        </button>
                    </div>
                </div>

                {/* Right Side: Tab content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tab 1: Learning Progress */}
                    {activeTab === 'progress' && isStudent && (
                        <div className="glass-panel p-8 rounded-2xl space-y-6">
                            <h2 className="text-xl font-bold text-white">Khóa học của tôi</h2>
                            
                            {coursesLoading ? (
                                <div className="text-slate-400 py-6">Đang tải danh mục khóa học...</div>
                            ) : myCourses.length === 0 ? (
                                <div className="text-center py-12 space-y-4">
                                    <p className="text-slate-400 text-sm">Bạn chưa đăng ký tham gia khóa học nào.</p>
                                    <Link href="/courses" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-xs font-semibold text-white transition-colors hover:bg-primary-hover">
                                        Khám phá khóa học ngay
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {myCourses.map((c) => (
                                        <div key={c.course_id} className="glass-card p-6 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center gap-6 justify-between">
                                            <div className="flex-1 w-full space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-white text-base leading-snug">{c.course_title}</h3>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                                        c.status === 'COMPLETED'
                                                            ? 'border-green-500/30 bg-green-500/10 text-green-500'
                                                            : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                        {c.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang học'}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-xs text-slate-400 font-medium">
                                                        <span>Hoàn thành: {c.completed_lessons}/{c.total_lessons} bài học</span>
                                                        <span>{c.progress_percentage}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                                        <div className="bg-success h-full transition-all duration-500" style={{ width: `${c.progress_percentage}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                                                <Link
                                                    href={`/courses/${c.course_id}/learn`}
                                                    className="flex-1 sm:flex-initial inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
                                                >
                                                    Vào học
                                                </Link>
                                                {c.status === 'COMPLETED' && (
                                                    <Link
                                                        href={`/courses/${c.course_id}/outro`}
                                                        className="flex-1 sm:flex-initial inline-flex h-10 items-center justify-center rounded-md border border-white/10 bg-white/5 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                                                    >
                                                        Xem tổng kết
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Settings Profile Update */}
                    {activeTab === 'settings' && (
                        <div className="glass-panel p-8 rounded-2xl space-y-6">
                            <h2 className="text-xl font-bold text-white">Chỉnh sửa hồ sơ cá nhân</h2>

                            {msg && (
                                <div className={`rounded-md p-4 text-sm border ${
                                    msg.type === 'success'
                                        ? 'bg-green-950/30 border-green-500/30 text-green-200'
                                        : 'bg-red-950/30 border-red-500/30 text-red-200'
                                }`}>
                                    {msg.text}
                                </div>
                            )}

                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="fullName">
                                        Họ và tên
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        required
                                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-all"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="gender">
                                        Giới tính
                                    </label>
                                    <select
                                        id="gender"
                                        className="w-full rounded-md border border-white/10 bg-[#0E1322] px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-all"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">Chưa thiết lập</option>
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="dob">
                                        Ngày sinh
                                    </label>
                                    <input
                                        id="dob"
                                        type="date"
                                        className="w-full rounded-md border border-white/10 bg-[#0E1322] px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-all"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="phone">
                                        Số điện thoại
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-all"
                                        placeholder="0901234567"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="avatarUrl">
                                        Đường dẫn ảnh đại diện (Avatar URL)
                                    </label>
                                    <input
                                        id="avatarUrl"
                                        type="text"
                                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-all"
                                        placeholder="https://image-url.com/avatar.jpg"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="bio">
                                        Tiểu sử bản thân (Bio)
                                    </label>
                                    <textarea
                                        id="bio"
                                        rows={4}
                                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-all"
                                        placeholder="Nhập giới thiệu ngắn về bản thân..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="w-full flex h-11 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
                                    >
                                        {updating ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
