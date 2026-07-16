import { FileText } from 'lucide-react';

export default function NotepadWidgetCard() {
  return (
    <div className="w-56 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
        <FileText size={12} />
        <span>Scratchpad</span>
      </div>

      <div className="space-y-1.5">
        <div className="h-2.5 w-full rounded bg-black/5" />
        <div className="h-2.5 w-[88%] rounded bg-black/5" />
        <div className="h-2.5 w-[72%] rounded bg-black/5" />
        <div className="h-2.5 w-[80%] rounded bg-accent/10" />
      </div>

      <p className="mt-2 text-[11px] italic text-muted leading-relaxed">
        &ldquo;Review quarterly goals &mdash; ship the MVP by Friday&rdquo;
      </p>
    </div>
  );
}
