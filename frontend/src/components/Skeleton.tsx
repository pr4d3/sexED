import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
    return <div className={`animate-pulse rounded bg-surface-container-high ${className}`} />;
};

export const CourseCardSkeleton = () => {
    return (
        <div className="bg-white rounded-3xl p-5 border border-outline-variant/20 soft-shadow animate-pulse flex flex-col h-full space-y-4 justify-between">
            <div className="space-y-4">
                {/* Thumbnail placeholder */}
                <div className="w-full h-48 bg-surface-container-high rounded-2xl"></div>
                {/* Tag/Badge placeholder */}
                <div className="w-24 h-6 bg-surface-container rounded-full"></div>
                {/* Title placeholder */}
                <div className="space-y-2">
                    <div className="w-full h-5 bg-surface-container-high rounded-lg"></div>
                    <div className="w-2/3 h-5 bg-surface-container rounded-lg"></div>
                </div>
            </div>
            {/* Footer info placeholder */}
            <div className="pt-4 border-t border-surface-container flex justify-between items-center mt-auto">
                <div className="w-20 h-4 bg-surface-container rounded"></div>
                <div className="w-24 h-8 bg-surface-container-high rounded-full"></div>
            </div>
        </div>
    );
};

export const ForumPostSkeleton = () => {
    return (
        <div className="bg-white rounded-3xl p-6 border border-outline-variant/20 soft-shadow animate-pulse flex flex-col justify-between space-y-5">
            <div>
                {/* Author Info Header */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high" />
                    <div className="space-y-2">
                        <div className="w-28 h-4 bg-surface-container-high rounded-lg" />
                        <div className="w-20 h-3 bg-surface-container rounded-lg" />
                    </div>
                </div>
                {/* Title and Content Placeholders */}
                <div className="w-full h-5 bg-surface-container-high rounded-lg mb-3" />
                <div className="w-5/6 h-4 bg-surface-container rounded-lg mb-2" />
                <div className="w-2/3 h-4 bg-surface-container rounded-lg" />
            </div>
            
            {/* Card Footer Placeholders */}
            <div className="flex justify-between items-center pt-4 border-t border-surface-container">
                <div className="w-16 h-4 bg-surface-container rounded"></div>
                <div className="w-12 h-4 bg-surface-container-high rounded"></div>
            </div>
        </div>
    );
};

export const CourseIntroSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-8 animate-pulse">
            {/* Left Content Column */}
            <div className="w-full lg:w-[70%] space-y-8">
                <div className="space-y-4">
                    <div className="w-24 h-6 bg-surface-container rounded-full" />
                    <div className="w-3/4 h-10 bg-surface-container-high rounded-2xl" />
                    <div className="w-1/2 h-5 bg-surface-container rounded-lg" />
                </div>
                {/* Hero Image/Video Block */}
                <div className="w-full h-[350px] bg-surface-container-high rounded-3xl" />
                <div className="space-y-3">
                    <div className="w-full h-4 bg-surface-container rounded-lg" />
                    <div className="w-full h-4 bg-surface-container rounded-lg" />
                    <div className="w-4/5 h-4 bg-surface-container rounded-lg" />
                </div>
            </div>
            {/* Right Action Column */}
            <div className="w-full lg:w-[30%] space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-outline-variant/20 soft-shadow space-y-6">
                    <div className="w-full h-48 bg-surface-container-high rounded-2xl" />
                    <div className="space-y-3">
                        <div className="w-full h-12 bg-surface-container-high rounded-xl" />
                        <div className="w-full h-4 bg-surface-container rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ForumPostDetailSkeleton = () => {
    return (
        <div className="container mx-auto max-w-4xl px-4 md:px-8 py-12 space-y-8 animate-pulse">
            {/* Main Post Card */}
            <div className="bg-white p-8 rounded-3xl border border-outline-variant/20 soft-shadow space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high" />
                    <div className="space-y-2">
                        <div className="w-32 h-4 bg-surface-container-high rounded-lg" />
                        <div className="w-24 h-3 bg-surface-container rounded-lg" />
                    </div>
                </div>
                <div className="w-3/4 h-8 bg-surface-container-high rounded-xl" />
                <div className="space-y-3">
                    <div className="w-full h-4 bg-surface-container rounded-lg" />
                    <div className="w-full h-4 bg-surface-container rounded-lg" />
                    <div className="w-4/5 h-4 bg-surface-container rounded-lg" />
                </div>
            </div>
            
            {/* Comments Section */}
            <div className="space-y-4">
                <div className="w-28 h-6 bg-surface-container-high rounded-lg" />
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-6 bg-white/40 rounded-2xl border border-outline-variant/20 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface-container-high" />
                                <div className="w-24 h-4 bg-surface-container-high rounded-lg" />
                            </div>
                            <div className="w-5/6 h-4 bg-surface-container rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const LearnPageSkeleton = () => {
    return (
        <div className="flex flex-col h-screen w-full bg-background text-on-background font-sans antialiased overflow-hidden">
            {/* Header Skeleton */}
            <header className="glass-panel border-b border-outline-variant/30 flex flex-col h-auto w-full bg-white/85">
                <div className="flex items-center justify-between px-6 h-16 w-full max-w-screen-2xl mx-auto">
                    <div className="w-20 h-8 bg-surface-container-high rounded-full animate-pulse" />
                    <div className="w-1/3 h-6 bg-surface-container-high rounded-lg animate-pulse" />
                    <div className="w-12 h-6 bg-surface-container-high rounded-lg animate-pulse" />
                </div>
                <div className="w-full h-1.5 bg-surface-container-high" />
            </header>

            {/* Main Area */}
            <div className="flex-grow w-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row h-[calc(100vh-72px)] overflow-hidden">
                {/* Left Area: Content Canvas Skeleton */}
                <div className="flex-grow flex flex-col h-full overflow-y-auto bg-surface p-6 md:p-10">
                    <div className="w-full aspect-video bg-surface-container-high rounded-3xl animate-pulse mb-8" />
                    <div className="max-w-4xl mx-auto space-y-6 w-full">
                        <div className="flex gap-2">
                            <div className="w-16 h-5 bg-surface-container rounded-full animate-pulse" />
                            <div className="w-20 h-5 bg-surface-container rounded-full animate-pulse" />
                        </div>
                        <div className="w-3/4 h-8 bg-surface-container-high rounded-xl animate-pulse" />
                        <div className="space-y-3">
                            <div className="w-full h-4 bg-surface-container rounded-lg animate-pulse" />
                            <div className="w-full h-4 bg-surface-container rounded-lg animate-pulse" />
                            <div className="w-5/6 h-4 bg-surface-container rounded-lg animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Skeleton */}
                <aside className="w-full lg:w-[360px] flex-shrink-0 glass-panel border-l border-outline-variant/30 flex flex-col h-full overflow-hidden hidden lg:flex bg-white/70">
                    <div className="p-6 border-b border-outline-variant/30">
                        <div className="w-1/2 h-5 bg-surface-container-high rounded-lg animate-pulse mb-2" />
                        <div className="w-3/4 h-8 bg-surface-container rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="flex gap-4 p-4 border border-transparent">
                                <div className="w-5 h-5 rounded-full bg-surface-container-high animate-pulse mt-0.5" />
                                <div className="flex-1 space-y-2">
                                    <div className="w-full h-4 bg-surface-container-high rounded-lg animate-pulse" />
                                    <div className="w-24 h-3 bg-surface-container rounded-lg animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};
