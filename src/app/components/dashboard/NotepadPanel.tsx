"use client";

import { useState } from "react";

interface NotepadPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotepadPanel({ isOpen, onClose }: NotepadPanelProps) {
  const [content, setContent] = useState("");

  return (
    <div
      aria-hidden={!isOpen}
      className={`absolute top-0 left-0 right-0 z-20 flex justify-center transition-transform duration-300 ease-out ${
        isOpen ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto mt-24 w-full max-w-2xl rounded-b-[28px] bg-surface p-6 shadow-lg ring-1 ring-black/5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-fraunces text-base font-medium text-ink">
            Scratchpad
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted transition-all duration-200 hover:text-ink hover:bg-black/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close notepad"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Jot something down…"
          className="min-h-[240px] w-full resize-none rounded-2xl bg-page-bg/60 p-5 text-sm text-ink leading-relaxed outline-none transition-all duration-200 placeholder:text-muted/40 focus:ring-2 focus:ring-accent/20"
        />
        <p className="mt-2 text-right text-[11px] text-muted">
          {content.length} character{content.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
