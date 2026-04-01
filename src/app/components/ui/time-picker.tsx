"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Clock, ChevronDown } from "lucide-react";
import { cn } from "./utils";

interface TimePickerProps {
  value: string;
  onChange: (timeStr: string) => void;
  slots: string[];
  placeholder?: string;
  required?: boolean;
  name?: string;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  slots,
  placeholder = "Select Time",
  required,
  name,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ top: 0, left: 0, width: 0 });

  // Position the portal dropdown relative to trigger (fixed positioning = viewport coords)
  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 260;
    const top = spaceBelow < dropdownHeight ? rect.top - dropdownHeight - 8 : rect.bottom + 8;
    setPos({
      top,
      left: rect.left,
      width: Math.max(rect.width, 300),
    });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  const handleSelect = (slot: string) => {
    onChange(slot);
    setOpen(false);
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

  // Split slots into AM/PM groups
  const amSlots = slots.filter((s) => s.includes("AM"));
  const pmSlots = slots.filter((s) => s.includes("PM"));

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
          "site-dark-input group flex w-full items-center gap-2.5 rounded-2xl px-4 py-3 text-left text-[1rem] md:text-[0.8125rem] outline-none transition-all duration-200",
          open
            ? "border-white/18 ring-2 ring-white/8 shadow-lg shadow-black/30"
            : "hover:border-white/16",
          value ? "text-white" : "text-gray-500",
        )}
      >
        <Clock className={cn("h-4 w-4 shrink-0 transition-colors", open ? "text-violet-300" : "text-gray-500 group-hover:text-white")} />
        <span className="flex-1 truncate">{value || placeholder}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999]"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            <div className="site-dark-panel rounded-2xl border border-gray-800/50 p-4 shadow-2xl shadow-black/60 animate-in fade-in-0 zoom-in-[0.98] slide-in-from-top-1 duration-200">
              {amSlots.length > 0 && (
                <div>
                  <span className="mb-2 block text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Morning
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {amSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSelect(slot)}
                        className={cn(
                          "rounded-xl px-2 py-2 text-[0.6875rem] font-medium transition-all duration-150",
                          value === slot
                            ? "bg-white text-black shadow-md shadow-white/10 ring-1 ring-white/15"
                            : "border border-white/8 bg-black/40 text-gray-400 hover:border-white/16 hover:bg-white/[0.06] hover:text-white",
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {pmSlots.length > 0 && (
                <div className={amSlots.length > 0 ? "mt-3 border-t border-white/8 pt-3" : ""}>
                  <span className="mb-2 block text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Afternoon
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {pmSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSelect(slot)}
                        className={cn(
                          "rounded-xl px-2 py-2 text-[0.6875rem] font-medium transition-all duration-150",
                          value === slot
                            ? "bg-white text-black shadow-md shadow-white/10 ring-1 ring-white/15"
                            : "border border-white/8 bg-black/40 text-gray-400 hover:border-white/16 hover:bg-white/[0.06] hover:text-white",
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
