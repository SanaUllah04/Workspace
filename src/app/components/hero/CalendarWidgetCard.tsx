import { CalendarDays } from 'lucide-react';

function getNextEvent(): {
  title: string;
  time: string;
  day: number;
  month: string;
} {
  const now = new Date();
  return {
    day: now.getDate(),
    month: now.toLocaleDateString('en-US', { month: 'short' }),
    title: 'Sprint Review',
    time: '3:00 PM – 4:00 PM',
  };
}

export default function CalendarWidgetCard() {
  const event = getNextEvent();

  return (
    <div className="w-56 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
        <CalendarDays size={12} />
        <span>Calendar</span>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex shrink-0 flex-col items-center rounded-lg bg-accent/10 px-3 py-2">
          <span className="text-xs font-semibold uppercase text-accent">
            {event.month}
          </span>
          <span className="font-fraunces text-xl font-medium text-ink leading-none">
            {event.day}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-ink leading-snug">
            {event.title}
          </p>
          <p className="mt-0.5 text-xs text-muted">{event.time}</p>
        </div>
      </div>
    </div>
  );
}
