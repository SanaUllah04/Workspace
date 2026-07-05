"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const TOTAL_CELLS = 42; // 6 rows x 7 days

interface CalendarPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function buildGrid(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; isCurrentMonth: boolean }[] = [];

  // Previous month overflow
  for (let i = startDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true });
  }

  // Next month overflow — pad to exactly TOTAL_CELLS
  const remaining = TOTAL_CELLS - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, isCurrentMonth: false });
  }

  return cells;
}

export default function CalendarPanel({ isOpen, onClose }: CalendarPanelProps) {
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const cells = useMemo(() => buildGrid(year, month), [year, month]);

  function prevMonth() {
    setMonth((m) => {
      if (m === 0) { setYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }

  function nextMonth() {
    setMonth((m) => {
      if (m === 11) { setYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }

  const isToday = (d: number, current: boolean) =>
    current && d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div
      aria-hidden={!isOpen}
      className={`absolute top-0 right-0 z-20 h-full w-72 transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col rounded-l-[28px] bg-surface p-5 shadow-lg ring-1 ring-black/5 overflow-y-auto">
        {/* Close button + month/year + nav — fixed height header */}
        <div className="shrink-0">
          <div className="mb-1 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-muted transition-all duration-200 hover:text-ink hover:bg-black/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Close calendar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <p className="font-fraunces text-lg font-medium text-ink mb-3">
            {MONTHS[month]} {year}
          </p>

          <div className="mb-3 flex items-center gap-2">
            <button
              type="button"
              onClick={prevMonth}
              className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-all duration-200 hover:bg-accent/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-all duration-200 hover:bg-accent/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Fixed-height grid (6 rows = 42 cells) */}
        <div className="grid grid-cols-7 gap-y-1 text-center text-xs min-h-[228px]">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
              {d}
            </div>
          ))}
          {cells.map((cell, i) => (
            <button
              key={i}
              type="button"
              disabled={!cell.isCurrentMonth}
              className={`rounded-lg py-1.5 text-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isToday(cell.day, cell.isCurrentMonth)
                  ? "bg-highlight font-semibold text-white"
                  : cell.isCurrentMonth
                  ? "text-ink hover:bg-black/5"
                  : "text-muted/40"
              }`}
            >
              {cell.day}
            </button>
          ))}
        </div>

        {/* Google Calendar stub */}
        <div className="mt-auto pt-4 border-t border-black/5 shrink-0">
          <button
            type="button"
            className="w-full rounded-full border border-accent/30 px-4 py-2 text-xs font-semibold text-accent transition-all duration-200 hover:bg-accent/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Connect Google Calendar
          </button>
          <p className="mt-1.5 text-center text-[10px] text-muted">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
