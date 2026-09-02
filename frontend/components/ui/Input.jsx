"use client";

import { forwardRef } from "react";

export const Input = forwardRef(function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}, ref) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-on-surface mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          w-full rounded-xl border bg-surface px-4 py-3 text-on-surface
          placeholder:text-muted/60
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          disabled:bg-surface-dim disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-500/20" : "border-surface-dim hover:border-primary/50"}
        `}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export const Textarea = forwardRef(function Textarea({
  label,
  error,
  helperText,
  className = "",
  id,
  rows = 4,
  ...props
}, ref) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-on-surface mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`
          w-full rounded-xl border bg-surface px-4 py-3 text-on-surface
          placeholder:text-muted/60 resize-y min-h-[100px]
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          disabled:bg-surface-dim disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-500/20" : "border-surface-dim hover:border-primary/50"}
        `}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export const Select = forwardRef(function Select({
  label,
  error,
  helperText,
  className = "",
  id,
  options = [],
  placeholder,
  ...props
}, ref) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-on-surface mb-1.5"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`
          w-full rounded-xl border bg-surface px-4 py-3 text-on-surface
          appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b6560' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")] bg-[right_0.75rem_center] bg-no-repeat pr-10
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          disabled:bg-surface-dim disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-500/20" : "border-surface-dim hover:border-primary/50"}
        `}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${selectId}-helper`} className="mt-1.5 text-sm text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";