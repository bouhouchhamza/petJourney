import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

/**
 * Toast notification component.
 * Usage: <Toast message="Added to cart!" visible={show} onClose={() => setShow(false)} />
 */
export default function Toast({ message, visible, onClose, type = 'success', duration = 2500 }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => onClose?.(), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-3 px-6 py-3 rounded-custom-lg shadow-xl border transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      } ${
        type === 'success'
          ? 'bg-white border-status-success/20 text-status-success'
          : 'bg-white border-status-error/20 text-status-error'
      }`}
      role="alert"
    >
      <CheckCircle2 className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium text-text-heading">{message}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onClose?.(); }}
        className="p-1 rounded-full hover:bg-background-secondary transition-colors text-text-body/40"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
