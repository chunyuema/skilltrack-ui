import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface FormInputProps {
  label: string;
  name?: string;
  value: string | number;
  onChange?: (val: string) => void;
  type?: 'text' | 'textarea' | 'number' | 'month' | 'select';
  options?: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  isEditing?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  readOnlyClassName?: string;
  renderValue?: (value: string | number) => React.ReactNode;
}

export function FormInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  options = [],
  placeholder,
  disabled = false,
  icon,
  isEditing = true,
  className,
  labelClassName,
  inputClassName,
  readOnlyClassName,
  renderValue,
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
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={5}
            className={cn(commonInputStyles, "h-32 leading-relaxed")}
          />
        ) : type === 'select' ? (
          <div className="relative group">
            <select
              id={inputId}
              name={name}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              className={cn(
                commonInputStyles, 
                "appearance-none cursor-pointer pr-10 hover:border-primary/40 transition-colors"
              )}
            >
              {placeholder && <option value="" disabled>{placeholder}</option>}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-bg-deep text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary group-hover:text-primary transition-colors">
              <ChevronDown size={16} strokeWidth={2.5} />
            </div>
          </div>
        ) : (
          <input
            id={inputId}
            type={type}
            name={name}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={commonInputStyles}
          />
        )
      ) : (
        <div className={cn("text-white font-bold text-xl tracking-tight", type === 'textarea' && "whitespace-pre-wrap leading-relaxed", readOnlyClassName)}>
          {renderValue ? renderValue(value) : (value || <span className="text-slate-700 italic font-normal tracking-widest text-sm">NULL</span>)}
        </div>
      )}
    </div>
  );
}
