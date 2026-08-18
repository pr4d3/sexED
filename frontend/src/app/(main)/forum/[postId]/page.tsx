'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { ForumPostDetailSkeleton } from '@/components/Skeleton';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, MessageSquare, ShieldAlert, Reply, Trash2, EyeOff } from 'lucide-react';

interface Comment {
    id: string;
    content: string;
    parent_comment_id: string | null;
    status: 'PUBLISHED' | 'HIDDEN' | 'DELETED';
    author: {
        full_name: string;
        role: string;
    };
    created_at: string;
    replies: Comment[];
}

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    
    const postId = params.postId as string;
    
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();
    const [mainComment, setMainComment] = useState('');
    
    // Active comment id for replies
    const [replyToId, setReplyToId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        if (!postId) return;
        fetchPostDetail();
    }, [postId]);

    const fetchPostDetail = async () => {
        try {
            const res = await api.get(`/forum/posts/${postId}`);
            if (res.success) {
                setPost(res.data);
            }
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải chi tiết bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent, parentId: string | null) => {
        e.preventDefault();
        const content = parentId ? replyContent : mainComment;
        if (!content.trim()) return;

        try {
            const res = await api.post(`/forum/posts/${postId}/comments`, {
                content,
                parent_comment_id: parentId,
            });
            if (res.success) {
                showToast("Gửi bình luận thành công!", "success");
                if (parentId) {
                    setReplyToId(null);
                    setReplyContent('');
                } else {
                    setMainComment('');
                }
                fetchPostDetail(); // reload comments
            }
        } catch (err: any) {
            showToast(err.message || 'Lỗi khi gửi bình luận', 'error');
        }
    };

    const handleModeratePost = async (action: 'HIDE' | 'DELETE') => {
        if (!confirm(`Bạn chắc chắn muốn [${action === 'HIDE' ? 'Ẩn' : 'Xóa'}] bài viết này?`)) return;
        try {
            const res = await api.put(`/admin/forum/posts/${postId}/moderate`, { action });
            if (res.success) {
                showToast("Kiểm duyệt bài viết thành công!", "success");
                router.push('/forum');
            }
        } catch (err: any) {
            showToast(err.message || 'Không thể kiểm duyệt bài viết', 'error');
        }
    };

    const handleModerateComment = async (commentId: string, action: 'HIDE' | 'DELETE') => {
        if (!confirm(`Bạn chắc chắn muốn [${action === 'HIDE' ? 'Ẩn' : 'Xóa'}] bình luận này?`)) return;
        try {
            const res = await api.put(`/admin/forum/comments/${commentId}/moderate`, { action });
            if (res.success) {
                showToast("Kiểm duyệt bình luận thành công!", "success");
                fetchPostDetail();
            }
        } catch (err: any) {
            showToast(err.message || 'Không thể kiểm duyệt bình luận', 'error');
        }
    };

    const countComments = (commentsList: Comment[]): number => {
        let count = commentsList.length;
        for (const c of commentsList) {
            if (c.replies) {
                count += countComments(c.replies);
            }
        }
        return count;
    };

    if (loading) {
        return <ForumPostDetailSkeleton />;
    }

    if (error || !post) {
        return (
            <div className="text-center py-20 max-w-md mx-auto space-y-4">
                <p className="text-red-400 font-semibold">{error || 'Không tìm thấy bài viết'}</p>
                <button onClick={() => router.push('/forum')} className="inline-flex h-9 items-center justify-center rounded-md bg-white/5 border border-white/10 px-4 text-xs font-semibold text-white">
                    Quay lại diễn đàn
                </button>
            </div>
        );
    }

    const isAdmin = user?.role === 'ADMIN';

    // Recursive component to render comments
    const CommentNode: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply = false }) => {
        const commentDate = new Date(comment.created_at);
        const showReplyForm = replyToId === comment.id;

        return (
            <div className="space-y-4">
                <div className={`bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 space-y-3 ${isReply ? 'ml-8 sm:ml-12 border-l-2 border-l-primary shadow-sm' : 'shadow-sm'}`}>
                    <div className="flex justify-between items-start text-xs text-on-surface-variant border-b border-outline-variant/10 pb-2">
                        <div className="flex items-center gap-2">
                            <strong className="text-on-surface font-semibold">{comment.author.full_name}</strong>
                            <span className="text-[10px] uppercase font-bold text-primary">
                                ({comment.author.role === 'ADMIN' ? 'Admin' : comment.author.role === 'INSTRUCTOR' ? 'Giảng viên' : 'Học viên'})
                            </span>
                            <span>•</span>
                            <span>{commentDate.toLocaleDateString('vi-VN')} {commentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {comment.status !== 'PUBLISHED' && (
                            <span className="text-[10px] text-red-500 font-bold border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 rounded uppercase">
                                {comment.status}
                            </span>
                        )}
                    </div>

                    <p className="text-on-surface text-sm leading-relaxed">{comment.content}</p>

                    <div className="flex gap-4 text-xs font-semibold">
                        {user && (
                            <button 
                                onClick={() => {
                                    setReplyToId(showReplyForm ? null : comment.id);
                                    setReplyContent('');
                                }} 
                                className="flex items-center gap-1 text-primary hover:underline cursor-pointer"
                            >
                                <Reply className="h-3.5 w-3.5" />
                                Trả lời
                            </button>
                        )}
                        {isAdmin && (
                            <div className="flex gap-3 text-red-400">
                                <button onClick={() => handleModerateComment(comment.id, 'HIDE')} className="flex items-center gap-1 hover:underline cursor-pointer">
                                    <EyeOff className="h-3.5 w-3.5" />
                                    Ẩn
                                </button>
                                <button onClick={() => handleModerateComment(comment.id, 'DELETE')} className="flex items-center gap-1 hover:underline cursor-pointer">
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Xóa
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Nested reply input */}
                    {showReplyForm && (
                        <form onSubmit={(e) => handleCommentSubmit(e, comment.id)} className="space-y-2 pt-2 border-t border-outline-variant/10">
                            <textarea
                                className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-2 text-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none"
                                rows={2}
                                required
                                placeholder="Viết phản hồi thảo luận y khoa..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setReplyToId(null)}
                                    className="h-8 rounded px-3 text-[10px] font-semibold text-on-surface-variant hover:text-on-surface"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="h-8 rounded bg-accent px-4 text-[10px] font-bold text-white hover:bg-accent-hover cursor-pointer"
                                >
                                    Gửi phản hồi
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {comment.replies && comment.replies.map((reply) => (
                    <CommentNode key={reply.id} comment={reply} isReply={true} />
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
            <Link 
                href="/forum" 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors mb-6"
            >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Quay lại Diễn đàn
            </Link>

            <article className="glass-panel p-8 rounded-2xl border border-outline-variant/30 space-y-6 shadow-sm">
                {/* Header */}
                <div className="space-y-4 border-b border-outline-variant/20 pb-6">
                    <div className="flex justify-between items-start gap-4">
                        <span className="inline-flex px-2.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                            {post.category_name}
                        </span>
                        
                        {isAdmin && (
                            <div className="flex gap-3 text-xs font-semibold text-red-500 border border-red-500/20 bg-red-500/5 px-3 py-1.5 rounded-lg">
                                <span className="flex items-center gap-1 text-on-surface-variant font-bold uppercase text-[9px] mr-1">
                                    <ShieldAlert className="h-3.5 w-3.5" />
                                    Admin:
                                </span>
                                <button onClick={() => handleModeratePost('HIDE')} className="hover:underline cursor-pointer">Ẩn bài</button>
                                <span>|</span>
                                <button onClick={() => handleModeratePost('DELETE')} className="hover:underline cursor-pointer">Xóa bài</button>
                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight leading-snug">{post.title}</h1>
                    
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-2">
                        <span>Đăng bởi: <strong className="text-on-surface font-semibold">{post.author.full_name}</strong></span>
                        <span>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>

                {/* Body */}
                <div className="text-on-surface-variant text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                    {post.content}
                </div>
            </article>

            {/* Comments block */}
            <div className="space-y-8">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-t border-outline-variant/30 pt-8">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Ý kiến thảo luận ({countComments(post.comments)})
                </h3>

                {/* Main Comment Input Form (only if logged in) */}
                {user ? (
                    <form onSubmit={(e) => handleCommentSubmit(e, null)} className="space-y-3">
                        <textarea
                            className="w-full rounded-2xl border border-outline-variant/30 bg-white px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-inner"
                            rows={3}
                            required
                            placeholder="Chia sẻ suy nghĩ, ý kiến đóng góp khoa học của bạn..."
                            value={mainComment}
                            onChange={(e) => setMainComment(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-xs font-semibold text-white transition-colors hover:bg-primary-hover cursor-pointer"
                        >
                            Gửi bình luận
                        </button>
                    </form>
                ) : (
                    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container/50 p-4 text-center text-sm text-on-surface-variant">
                        Vui lòng{' '}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Đăng nhập
                        </Link>{' '}
                        để đóng góp ý kiến thảo luận.
                    </div>
                )}

                {/* Comments List tree */}
                <div className="space-y-6">
                    {post.comments.length === 0 ? (
                        <p className="text-sm text-on-surface-variant py-4">Chưa có ý kiến phản hồi nào.</p>
                    ) : (
                        post.comments.map((comment: Comment) => (
                            <CommentNode key={comment.id} comment={comment} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
