'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Users, Filter } from 'lucide-react';

interface ManagedCourse {
    course_id: string;
    title: string;
}

interface StudentProgress {
    student_id: string;
    full_name: string;
    email: string;
    role: 'STUDENT_PARENT' | 'STUDENT_CHILD';
    enrolled_at: string;
    completed_at: string | null;
    status: 'IN_PROGRESS' | 'COMPLETED';
    progress_percentage: number;
    completed_lessons_count: number;
}

export default function DashboardStudentsPage() {
    const { user } = useAuth();
    
    const [courses, setCourses] = useState<ManagedCourse[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [students, setStudents] = useState<StudentProgress[]>([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [studentsLoading, setStudentsLoading] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/instructor/dashboard/courses');
                if (res.success && res.data.length > 0) {
                    setCourses(res.data);
                    setSelectedCourseId(res.data[0].course_id);
                }
            } catch (err) {
                console.error("Error loading courses list", err);
            } finally {
                setCoursesLoading(false);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (!selectedCourseId) return;
        fetchStudentsProgress();
    }, [selectedCourseId]);

    const fetchStudentsProgress = async () => {
        setStudentsLoading(true);
        try {
            const res = await api.get(`/instructor/dashboard/courses/${selectedCourseId}/students`);
            if (res.success) {
                setStudents(res.data.students);
            }
        } catch (err) {
            console.error("Error loading students progress list", err);
        } finally {
            setStudentsLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-white">Theo Dõi Học Viên</h1>
                    <p className="text-xs text-slate-400 mt-1">Đánh giá tiến trình học tập phục vụ nghiên cứu khoa học</p>
                </div>

                {/* Course Selector Dropdown */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                    {coursesLoading ? (
                        <span className="text-xs text-slate-500">Đang tải danh sách...</span>
                    ) : (
                        <select
                            className="w-full sm:w-64 rounded-md border border-white/10 bg-[#0E1322] px-4 py-2.5 text-xs text-white focus:border-primary focus:outline-none"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                        >
                            {courses.length === 0 ? (
                                <option value="">Không tìm thấy khóa học nào</option>
                            ) : (
                                courses.map((c) => (
                                    <option key={c.course_id} value={c.course_id}>{c.title}</option>
                                ))
                            )}
                        </select>
                    )}
                </div>
            </div>

            {/* Students Progress Table */}
            <div className="glass-panel p-6 rounded-2xl space-y-6">
                {studentsLoading ? (
                    <div className="text-slate-400 py-12 text-center text-xs">Đang tải tiến trình chi tiết của học viên...</div>
                ) : !selectedCourseId ? (
                    <div className="text-slate-500 py-12 text-center text-xs">Vui lòng chọn hoặc tạo mới khóa học để theo dõi.</div>
                ) : students.length === 0 ? (
                    <div className="text-slate-500 py-12 text-center text-xs">Chưa có học viên nào đăng ký tham gia khóa học này.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                    <th className="py-3.5 px-4 bg-white/[0.01]">Học viên</th>
                                    <th className="py-3.5 px-4 bg-white/[0.01]">Vai trò</th>
                                    <th className="py-3.5 px-4 bg-white/[0.01]">Ngày tham gia</th>
                                    <th className="py-3.5 px-4 bg-white/[0.01]">Tiến độ</th>
                                    <th className="py-3.5 px-4 bg-white/[0.01]">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => {
                                    const isParent = student.role === 'STUDENT_PARENT';
                                    const roleText = isParent ? 'Phụ huynh' : 'Trẻ nhỏ';
                                    const roleClass = isParent 
                                        ? 'border-orange-500/20 bg-orange-500/10 text-accent' 
                                        : 'border-violet-500/20 bg-violet-500/10 text-primary';

                                    const isCompleted = student.status === 'COMPLETED';
                                    
                                    return (
                                        <tr key={student.student_id} className="border-b border-white/5 hover:bg-white/[0.01] transition-all">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-slate-300">
                                                        {student.full_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <strong className="text-white text-xs block leading-tight">{student.full_name}</strong>
                                                        <span className="text-[10px] text-slate-500 mt-1 block">{student.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${roleClass}`}>
                                                    {roleText}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-slate-400">
                                                {new Date(student.enrolled_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="py-4 px-4 space-y-1.5 w-60">
                                                <div className="flex justify-between font-bold text-slate-300 text-[10px]">
                                                    <span>Đã học: {student.completed_lessons_count} bài</span>
                                                    <span>{student.progress_percentage}%</span>
                                                </div>
                                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-success h-full transition-all duration-300" style={{ width: `${student.progress_percentage}%` }} />
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                                    isCompleted 
                                                        ? 'bg-green-500/10 text-green-500' 
                                                        : 'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                    {isCompleted ? 'Hoàn thành' : 'Đang học'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
