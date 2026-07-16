'use client';

import { useState, useEffect } from 'react';
import { CloudSun } from 'lucide-react';

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

interface TimeLocationWeatherProps {
  location?: string;
  temperature?: string;
}

export default function TimeLocationWeather({
  location = 'Peshawar, PK',
  temperature = '31°C',
}: TimeLocationWeatherProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-6 left-6 z-20 lg:top-10 lg:left-12">
      <div className="rounded-2xl bg-surface px-4 py-2.5 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center gap-3">
          <CloudSun size={18} className="text-highlight shrink-0" />
          <div className="text-left">
            {time && (
              <p className="font-fraunces text-lg font-medium text-ink leading-tight tracking-tight">
                {formatTime(time)}
              </p>
            )}
            {time && (
              <p className="text-[11px] text-muted leading-tight">
                {formatDate(time)}
              </p>
            )}
            <p className="text-[11px] text-muted leading-tight">
              {temperature} &middot; {location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
