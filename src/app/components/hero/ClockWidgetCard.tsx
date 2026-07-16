'use client';

import { useState, useEffect } from 'react';
import { Clock, Sun } from 'lucide-react';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

interface ClockWidgetCardProps {
  location?: string;
  temperature?: string;
}

export default function ClockWidgetCard({
  location = 'Peshawar, PK',
  temperature = '31°C',
}: ClockWidgetCardProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-56 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
        <Clock size={12} />
        <span>Live Clock</span>
      </div>

      {time ? (
        <p className="font-fraunces text-2xl font-medium text-ink tracking-tight">
          {formatTime(time)}
        </p>
      ) : (
        <p className="font-fraunces text-2xl font-medium text-ink tracking-tight">
          --
        </p>
      )}

      {time && <p className="mt-0.5 text-xs text-muted">{formatDate(time)}</p>}

      <div className="mt-3 flex items-center gap-2 border-t border-black/5 pt-3">
        <Sun size={16} className="text-highlight" />
        <span className="text-sm text-ink">{temperature}</span>
        <span className="text-xs text-muted">{location}</span>
      </div>
    </div>
  );
}
