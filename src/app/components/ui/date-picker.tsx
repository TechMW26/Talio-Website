"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { format, parse, isValid } from "date-fns";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Calendar } from "./calendar";
import { cn } from "./utils";

interface DatePickerProps {
  value: string; // YYYY-MM-DD string
  onChange: (dateStr: string) => void;
  minDate?: string; // YYYY-MM-DD string
  placeholder?: string;
  required?: boolean;
  name?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  minDate,
  placeholder = "Select a date",
  required,
  name,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ top: 0, left: 0, width: 0 });

  const selectedDate = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const disabledBefore = minDate ? parse(minDate, "yyyy-MM-dd", new Date()) : undefined;

  // Position the portal dropdown relative to trigger (fixed positioning = viewport coords)
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 340;
    const top = spaceBelow < dropdownHeight ? rect.top - dropdownHeight - 8 : rect.bottom + 8;
    setPos({
      top,
      left: rect.left,
      width: Math.max(rect.width, 310),
    });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  const handleSelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      onChange(format(date, "yyyy-MM-dd"));
      setOpen(false);
    }
  };

  // Close on outside click / touch
  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className={cn("relative", className)}>
      {/* Hidden native input for form validation */}
      {required && (
        <input
          type="text"
          name={name}
          value={value}
          required
          readOnly
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
          aria-hidden
        />
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "group flex w-full items-center gap-2.5 rounded-2xl border bg-gray-950/80 px-4 py-3 text-left text-[16px] md:text-[13px] outline-none transition-all duration-200",
          open
            ? "border-blue-500/60 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/5"
            : "border-gray-700/60 hover:border-gray-600",
          value ? "text-white" : "text-gray-500",
        )}
      >
        <CalendarDays className={cn("h-4 w-4 shrink-0 transition-colors", open ? "text-blue-400" : "text-gray-500 group-hover:text-blue-400")} />
        <span className="flex-1 truncate">
          {selectedDate && isValid(selectedDate)
            ? format(selectedDate, "dd MMM yyyy")
            : placeholder}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999]"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="rounded-2xl border border-gray-700/50 bg-gray-900/95 p-1 shadow-2xl shadow-black/60 backdrop-blur-xl animate-in fade-in-0 zoom-in-[0.98] slide-in-from-top-1 duration-200">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}
                defaultMonth={selectedDate || disabledBefore || new Date()}
                disabled={disabledBefore ? { before: disabledBefore } : undefined}
                required={required}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
