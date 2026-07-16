'use client';

import { useState } from 'react';

interface NotepadPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotepadPanel({ isOpen, onClose }: NotepadPanelProps) {
  const [content, setContent] = useState('');

  return (
    <div
      aria-hidden={!isOpen}
      className={`absolute top-0 left-0 right-0 z-20 flex justify-center transition-transform duration-300 ease-out ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto mt-24 w-full max-w-2xl rounded-b-[28px] bg-surface p-6 shadow-lg ring-1 ring-black/5">
        {/* No close button inside — only toggle outside */}
        <h3 className="font-fraunces text-base font-medium text-ink mb-4">
          Scratchpad
        </h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Jot something down…"
          className="min-h-[240px] w-full resize-none rounded-2xl bg-page-bg/60 p-5 text-sm text-ink leading-relaxed outline-none transition-all duration-200 placeholder:text-muted/40 focus:ring-2 focus:ring-accent/20"
        />
        <p className="mt-2 text-right text-[11px] text-muted">
          {content.length} character{content.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
