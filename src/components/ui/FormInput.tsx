import React from 'react';
import { cn } from '../../lib/utils';

interface FormInputProps {
  label: string;
  name?: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: 'text' | 'textarea' | 'number' | 'month';
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  isEditing?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  readOnlyClassName?: string;
}

export function FormInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  icon,
  isEditing = true,
  className,
  labelClassName,
  inputClassName,
  readOnlyClassName,
}: FormInputProps) {
  const inputId = React.useId();
  const commonInputStyles = cn(
    "w-full px-5 py-4 bg-bg-deep border border-divider rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base disabled:opacity-50",
    inputClassName
  );

  return (
    <div className={cn("space-y-3", className)}>
      <label 
        htmlFor={isEditing ? inputId : undefined}
        className={cn("text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2", labelClassName)}
      >
        {icon}
        {label}
      </label>
      {isEditing ? (
        type === 'textarea' ? (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={5}
            className={cn(commonInputStyles, "h-32 leading-relaxed")}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={commonInputStyles}
          />
        )
      ) : (
        <div className={cn("text-white font-bold text-xl tracking-tight", type === 'textarea' && "whitespace-pre-wrap leading-relaxed", readOnlyClassName)}>
          {value || <span className="text-slate-700 italic font-normal tracking-widest text-sm">NULL</span>}
        </div>
      )}
    </div>
  );
}
