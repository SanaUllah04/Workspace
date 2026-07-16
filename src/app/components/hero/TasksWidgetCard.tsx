import { CheckSquare, Square } from 'lucide-react';

const tasks = [
  { label: 'Review PR #142', done: true },
  { label: 'Write release notes', done: true },
  { label: 'Prep for standup', done: false },
];

export default function TasksWidgetCard() {
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="w-56 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
        <CheckSquare size={12} />
        <span>Today&apos;s Tasks</span>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.label} className="flex items-start gap-2">
            {task.done ? (
              <CheckSquare size={14} className="mt-0.5 shrink-0 text-accent" />
            ) : (
              <Square size={14} className="mt-0.5 shrink-0 text-muted" />
            )}
            <span
              className={`text-xs leading-snug ${
                task.done ? 'text-muted line-through' : 'text-ink'
              }`}
            >
              {task.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center gap-2 border-t border-black/5 pt-3">
        <div className="h-1.5 flex-1 rounded-full bg-black/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${(doneCount / tasks.length) * 100}%` }}
          />
        </div>
        <span className="text-[11px] font-medium text-muted">
          {doneCount}/{tasks.length}
        </span>
      </div>
    </div>
  );
}
