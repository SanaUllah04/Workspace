"use client";

import { useState } from "react";
import { CheckSquare, Square, Trash2, Plus } from "lucide-react";

interface Task {
  id: string;
  label: string;
  done: boolean;
}

interface TasksPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TasksPanel({ isOpen, onClose }: TasksPanelProps) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", label: "Review PR #142", done: true },
    { id: "2", label: "Write release notes", done: true },
    { id: "3", label: "Prep for standup", done: false },
  ]);
  const [input, setInput] = useState("");

  function addTask() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: trimmed, done: false },
    ]);
    setInput("");
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div
      aria-hidden={!isOpen}
      className={`absolute bottom-0 right-0 z-20 w-72 transition-transform duration-300 ease-out ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex flex-col rounded-tl-[28px] bg-surface p-5 pb-20 shadow-lg ring-1 ring-black/5 max-h-[85vh] min-h-0">
        {/* Header — no close button inside, only toggle outside */}
        <h3 className="font-fraunces text-base font-medium text-ink mb-4">
          Tasks &amp; Reminders
        </h3>

        {/* Add task */}
        <div className="mb-3 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a task..."
            className="min-w-0 flex-1 rounded-xl border border-black/10 bg-transparent px-3.5 py-2 text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="button"
            onClick={addTask}
            className="btn-base flex shrink-0 items-center justify-center rounded-full bg-accent p-2 text-white hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Add task"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Progress bar — always visible, pinned above scroll */}

        {/* Scrollable task list */}
        <ul className="space-y-1 overflow-y-auto min-h-0 flex-1">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="group flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-black/[0.03]"
            >
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="shrink-0 transition-all duration-200 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                aria-label={task.done ? "Mark as undone" : "Mark as done"}
              >
                {task.done ? (
                  <CheckSquare size={16} className="text-accent" />
                ) : (
                  <Square size={16} className="text-muted" />
                )}
              </button>
              <span
                className={`flex-1 text-sm leading-snug ${
                  task.done ? "text-muted line-through" : "text-ink"
                }`}
              >
                {task.label}
              </span>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="shrink-0 rounded p-0.5 text-muted opacity-0 transition-all duration-200 hover:text-highlight active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group-hover:opacity-100"
                aria-label={`Delete ${task.label}`}
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>

        {/* Progress — always visible at bottom */}
        <div className="mt-3 flex items-center gap-2 border-t border-black/5 pt-3 shrink-0">
          <div className="h-1.5 flex-1 rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{
                width:
                  tasks.length > 0
                    ? `${(doneCount / tasks.length) * 100}%`
                    : "0%",
              }}
            />
          </div>
          <span className="text-[11px] font-medium text-muted shrink-0">
            {doneCount}/{tasks.length}
          </span>
        </div>
      </div>
    </div>
  );
}
