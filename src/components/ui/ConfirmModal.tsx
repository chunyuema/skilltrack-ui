import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <Trash2 size={24} className="text-red-500" />,
      iconBg: 'bg-red-500/10 border-red-500/20',
      confirmBg: 'bg-red-500 hover:bg-red-600 shadow-red-500/20',
    },
    warning: {
      icon: <AlertTriangle size={24} className="text-amber-500" />,
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      confirmBg: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
    },
    info: {
      icon: <AlertTriangle size={24} className="text-primary" />,
      iconBg: 'bg-primary/10 border-primary/20',
      confirmBg: 'bg-primary hover:bg-primary-hover shadow-primary/20',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-bg-card border border-divider p-8 rounded-xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className={`w-12 h-12 ${style.iconBg} border rounded-full flex items-center justify-center mb-6 mx-auto`}>
          {style.icon}
        </div>
        <h3 className="text-lg font-black text-white text-center uppercase tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-xs text-text-secondary text-center leading-relaxed mb-8">
          {description}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase rounded transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 ${style.confirmBg} text-white text-[10px] font-black uppercase rounded transition-colors shadow-lg`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
