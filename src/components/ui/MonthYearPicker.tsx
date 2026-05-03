import React from 'react';
import { Calendar } from 'lucide-react';

interface MonthYearPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  allowPresent?: boolean;
}

export function MonthYearPicker({
  label,
  value,
  onChange,
  allowPresent = false,
}: MonthYearPickerProps) {
  const isPresent = value === 'Present';

  // Parse YYYY-MM
  const [year, month] = !isPresent && value.includes('-') ? value.split('-') : ['', ''];

  const years = Array.from({ length: 50 }, (_, i) =>
    (new Date().getFullYear() + 2 - i).toString()
  );
  
  const months = [
    { val: '01', label: 'Jan' }, { val: '02', label: 'Feb' }, { val: '03', label: 'Mar' },
    { val: '04', label: 'Apr' }, { val: '05', label: 'May' }, { val: '06', label: 'Jun' },
    { val: '07', label: 'Jul' }, { val: '08', label: 'Aug' }, { val: '09', label: 'Sep' },
    { val: '10', label: 'Oct' }, { val: '11', label: 'Nov' }, { val: '12', label: 'Dec' },
  ];

  const handleMonthChange = (newMonth: string) => {
    if (!year) return onChange(`${new Date().getFullYear()}-${newMonth}`);
    onChange(`${year}-${newMonth}`);
  };

  const handleYearChange = (newYear: string) => {
    if (!month) return onChange(`${newYear}-01`);
    onChange(`${newYear}-${month}`);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
          <Calendar size={12} className="text-primary" />
          {label}
        </label>
        {allowPresent && (
          <label className="flex items-center gap-2 text-[10px] font-black text-text-secondary uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={isPresent}
              onChange={(e) => onChange(e.target.checked ? 'Present' : '')}
              className="accent-primary"
            />
            Present
          </label>
        )}
      </div>
      <div className="flex gap-3">
        <select
          disabled={isPresent}
          className="flex-1 px-4 py-3 bg-bg-deep border border-divider rounded text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all text-sm font-mono disabled:opacity-50 appearance-none"
          value={month}
          onChange={(e) => handleMonthChange(e.target.value)}
        >
          <option value="" disabled>
            Month
          </option>
          {months.map((m) => (
            <option key={m.val} value={m.val}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          disabled={isPresent}
          className="flex-1 px-4 py-3 bg-bg-deep border border-divider rounded text-white focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all text-sm font-mono disabled:opacity-50 appearance-none"
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
        >
          <option value="" disabled>
            Year
          </option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
