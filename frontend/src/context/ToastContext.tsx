'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: any, type: ToastType = 'info') => {
        let text = 'Thông báo';
        if (typeof message === 'string') {
            text = message;
        } else if (message instanceof Error) {
            text = message.message;
        } else if (message && typeof message === 'object') {
            text = message.message || message.msg || message.detail || JSON.stringify(message);
        } else if (message !== undefined && message !== null) {
            text = String(message);
        }

        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message: text, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
                {toasts.map((toast) => {
                    let iconName = 'info';
                    let iconColorClass = 'text-primary';

                    if (toast.type === 'success') {
                        iconName = 'check_circle';
                        iconColorClass = 'text-green-600';
                    } else if (toast.type === 'error') {
                        iconName = 'cancel';
                        iconColorClass = 'text-red-600';
                    } else if (toast.type === 'warning') {
                        iconName = 'warning';
                        iconColorClass = 'text-amber-600';
                    }

                    return (
                        <div
                            key={toast.id}
                            className="pointer-events-auto flex items-center gap-3 bg-white text-on-surface px-5 py-4 rounded-2xl border border-outline-variant/30 shadow-2xl backdrop-blur-md transition-all duration-300 animate-slide-in"
                        >
                            <span className={`material-symbols-outlined ${iconColorClass} text-xl flex-shrink-0`}>
                                {iconName}
                            </span>
                            <div className="flex-grow text-xs font-bold text-on-surface leading-relaxed">
                                {toast.message}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-outline hover:text-on-surface transition-colors cursor-pointer flex-shrink-0"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
