import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div
          className={`relative w-full ${maxWidth} transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left shadow-2xl transition-all border border-slate-100 animate-scale-in`}
        >
          {showClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {(title || subtitle) && (
            <div className="mb-6 pr-8">
              {title && (
                <h3
                  id="modal-title"
                  className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
