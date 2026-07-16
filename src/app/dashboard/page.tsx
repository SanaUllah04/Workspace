'use client';

import { useState } from 'react';
import { CalendarDays, CheckSquare, PenLine, BookOpen, X } from 'lucide-react';
import TimeLocationWeather from '@/app/components/dashboard/TimeLocationWeather';
import CalendarPanel from '@/app/components/dashboard/CalendarPanel';
import TasksPanel from '@/app/components/dashboard/TasksPanel';
import NotepadPanel from '@/app/components/dashboard/NotepadPanel';
import BookshelfPanel from '@/app/components/dashboard/BookshelfPanel';

type Panel = 'calendar' | 'tasks' | 'notepad' | 'bookshelf' | null;

function ToggleBtn({
  icon: Icon,
  activeIcon: ActiveIcon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  activeIcon?: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const IconComponent = active && ActiveIcon ? ActiveIcon : Icon;
  return (
    <button
      type="button"
      aria-expanded={active}
      aria-label={label}
      onClick={onClick}
      className={`btn-base flex items-center justify-center rounded-full p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
        active
          ? 'bg-accent text-white shadow-md hover:bg-accent-hover'
          : 'bg-surface text-muted shadow-sm ring-1 ring-black/5 hover:bg-white hover:text-accent hover:shadow-md'
      }`}
    >
      <IconComponent size={18} />
    </button>
  );
}

export default function DashboardPage() {
  const [openPanel, setOpenPanel] = useState<Panel>(null);

  function togglePanel(panel: Panel) {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-[1440px]">
        <div
          className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-black/5 md:min-h-[calc(100vh-3rem)] md:rounded-[40px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(61,90,128,0.04) 0%, transparent 70%), #ffffff',
          }}
        >
          {/* Time / Location / Weather — always visible top-right */}
          <TimeLocationWeather />

          {/* Module toggle buttons */}
          <div className="absolute top-6 right-6 z-30 flex flex-col items-center gap-3 lg:top-10 lg:right-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Calendar
              </span>
              <ToggleBtn
                icon={CalendarDays}
                activeIcon={X}
                label="Toggle calendar panel"
                active={openPanel === 'calendar'}
                onClick={() => togglePanel('calendar')}
              />
            </div>
          </div>

          <div className="absolute bottom-6 right-6 z-30 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Tasks
              </span>
              <ToggleBtn
                icon={CheckSquare}
                activeIcon={X}
                label="Toggle tasks panel"
                active={openPanel === 'tasks'}
                onClick={() => togglePanel('tasks')}
              />
            </div>
          </div>

          <div className="absolute top-6 left-1/2 z-30 -translate-x-1/2">
            <div className="flex flex-col items-center gap-1.5">
              <ToggleBtn
                icon={PenLine}
                activeIcon={X}
                label="Toggle notepad"
                active={openPanel === 'notepad'}
                onClick={() => togglePanel('notepad')}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Notepad
              </span>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 z-30 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <ToggleBtn
                icon={BookOpen}
                activeIcon={X}
                label="Toggle bookshelf"
                active={openPanel === 'bookshelf'}
                onClick={() => togglePanel('bookshelf')}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Bookshelf
              </span>
            </div>
          </div>

          {/* Sliding panels */}
          <CalendarPanel
            isOpen={openPanel === 'calendar'}
            onClose={() => setOpenPanel(null)}
          />
          <TasksPanel
            isOpen={openPanel === 'tasks'}
            onClose={() => setOpenPanel(null)}
          />
          <NotepadPanel
            isOpen={openPanel === 'notepad'}
            onClose={() => setOpenPanel(null)}
          />
          <BookshelfPanel
            isOpen={openPanel === 'bookshelf'}
            onClose={() => setOpenPanel(null)}
          />
        </div>
      </div>
    </div>
  );
}
