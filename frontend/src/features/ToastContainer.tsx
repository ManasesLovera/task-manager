import React from 'react';
import { useToastStore } from '../stores/toastStore';
import type { ToastType } from '../stores/toastStore';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-tertiary-container text-on-tertiary-container border-tertiary/20';
      case 'error':
        return 'bg-error-container text-on-error-container border-error/20';
      default:
        return 'bg-surface-container-high text-on-surface border-outline-variant/20';
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl shadow-black/5 min-w-[300px] pointer-events-auto animate-in slide-in-from-right-10 duration-300 ${getToastStyles(
            toast.type
          )}`}
        >
          <span className="material-symbols-outlined text-xl">
            {getIcon(toast.type)}
          </span>
          <p className="flex-grow text-sm font-bold">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-black/5 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
