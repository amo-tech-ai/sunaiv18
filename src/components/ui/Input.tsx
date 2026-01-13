import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  badge?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, badge, className, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</label>
        {badge}
      </div>
      <input 
        className={`
          w-full bg-transparent border-b border-stone-200 
          py-3 text-lg text-stone-900 placeholder:text-stone-300
          focus:outline-none focus:border-stone-900 transition-colors
          font-serif
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, className, ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</label>
      <textarea 
        className={`
          w-full bg-transparent border-b border-stone-200 
          py-3 text-base text-stone-900 placeholder:text-stone-300
          focus:outline-none focus:border-stone-900 transition-colors
          min-h-[100px] resize-none
          ${className}
        `}
        {...props}
      />
    </div>
  );
};