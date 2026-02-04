import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500/70',
    error: 'bg-red-700/70',
    info: 'bg-blue-500/70',
  }[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm pointer-events-auto`}
        style={{ animation: 'var(--animate-toast)' }}
      >
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
