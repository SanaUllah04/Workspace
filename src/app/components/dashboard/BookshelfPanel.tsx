"use client";

import { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Plus,
  X,
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  pages: string[];
  currentPage: number;
  color: string;
  height: number;
}

const SPINE_COLORS = [
  "#3d5a80", "#ee6c4d", "#1b2430", "#4a5568",
  "#2f4666", "#e85d3d", "#5a7a9e", "#f08c70",
  "#2c3a4a", "#3d5a80", "#ee6c4d", "#1b2430",
  "#5a7a9e", "#e85d3d", "#4a5568",
];

const SAMPLE_BOOKS: Book[] = [
  {
    id: "b1",
    title: "The Art of Focus",
    pages: [
      "In a world of endless distractions, the ability to focus deeply has become a superpower.\n\nThis is the premise upon which our entire workspace is built. Not to do more, but to do what matters.\n\nThe quiet mind is not empty — it is fully engaged with the present task.",
      "Deep work cannot be rushed. It requires rituals, boundaries, and a space that protects attention.\n\nYour digital environment should feel like a calm room with a single desk, not a crowded marketplace.\n\nEvery notification is a tax on your attention. Choose wisely what you allow through.",
      "The most productive people don't manage time — they manage attention.\n\nTime is fixed. Attention is variable. Protect it fiercely.\n\nBuild systems, not habits. Systems scale. Habits fade under pressure.",
    ],
    currentPage: 0,
    color: SPINE_COLORS[0],
    height: 180,
  },
  {
    id: "b2",
    title: "Notes on Notes",
    pages: [
      "The simple act of writing something down changes how you think about it.\n\nNotes are not just memory aids. They are thinking tools. When you write, you externalize your thoughts and can examine them from a distance.",
      "Good note-taking is not about capturing everything. It is about capturing what matters.\n\nAsk yourself: will I care about this tomorrow? Next week? Next year?\n\nIf the answer is no, let it go.",
    ],
    currentPage: 0,
    color: SPINE_COLORS[1],
    height: 160,
  },
  {
    id: "b3",
    title: "Calendar Zen",
    pages: [
      "Your calendar should feel like a garden, not a grid.\n\nBlock time for the important stuff first. Let the urgent fill what's left.\n\nIf everything is urgent, nothing is.",
      "Time blocking is the single most effective productivity technique.\n\nAssign every hour a job. Protect those hours like appointments with yourself.\n\nBecause that's exactly what they are.",
    ],
    currentPage: 0,
    color: SPINE_COLORS[2],
    height: 200,
  },
];

export default function BookshelfPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [view, setView] = useState<"shelf" | "reading">("shelf");
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [newBookInput, setNewBookInput] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);
  const [pageAnim, setPageAnim] = useState<"none" | "out" | "in">("none");
  const [displayPage, setDisplayPage] = useState(0);
  const [pendingDir, setPendingDir] = useState<"prev" | "next" | null>(null);

  const activeBook = activeBookId
    ? books.find((b) => b.id === activeBookId)
    : null;

  function openBook(bookId: string) {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;
    setActiveBookId(bookId);
    setDisplayPage(book.currentPage);
    setPageAnim("none");
    setView("reading");
  }

  function closeBook() {
    setView("shelf");
    setActiveBookId(null);
    setPageAnim("none");
  }

  const turnPage = useCallback(
    (dir: "prev" | "next") => {
      if (!activeBook || pageAnim !== "none") return;
      const book = books.find((b) => b.id === activeBookId);
      if (!book) return;
      const nextPage =
        dir === "next"
          ? Math.min(book.currentPage + 1, book.pages.length - 1)
          : Math.max(book.currentPage - 1, 0);
      if (nextPage === book.currentPage) return;
      setPendingDir(dir);
      setPageAnim("out");
    },
    [activeBook, activeBookId, books, pageAnim]
  );

  function handleAnimEnd() {
    if (pageAnim === "out" && activeBookId && pendingDir) {
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id !== activeBookId) return b;
          const next =
            pendingDir === "next"
              ? Math.min(b.currentPage + 1, b.pages.length - 1)
              : Math.max(b.currentPage - 1, 0);
          return { ...b, currentPage: next };
        })
      );
      setDisplayPage((prev) => {
        const book = books.find((b) => b.id === activeBookId);
        if (!book) return prev;
        return pendingDir === "next"
          ? Math.min(prev + 1, book.pages.length - 1)
          : Math.max(prev - 1, 0);
      });
      setPendingDir(null);
      setPageAnim("in");
    } else if (pageAnim === "in") {
      setPageAnim("none");
    }
  }

  function addBook() {
    const trimmed = newBookInput.trim();
    if (!trimmed) return;
    const newBook: Book = {
      id: crypto.randomUUID(),
      title: trimmed,
      pages: ["Start writing…"],
      currentPage: 0,
      color: SPINE_COLORS[books.length % SPINE_COLORS.length],
      height: 140 + Math.floor(Math.random() * 70),
    };
    setBooks((prev) => [...prev, newBook]);
    setNewBookInput("");
    setShowNewInput(false);
  }

  function updatePageContent(bookId: string, pageIndex: number, text: string) {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const newPages = [...b.pages];
        newPages[pageIndex] = text;
        return { ...b, pages: newPages };
      })
    );
  }

  return (
    <div
      aria-hidden={!isOpen}
      className={`absolute bottom-0 left-0 z-20 transition-all duration-300 ease-out ${
        isOpen
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="rounded-tr-[28px] rounded-br-[28px] bg-surface shadow-lg ring-1 ring-black/5 overflow-hidden"
        style={{ maxWidth: "90vw", width: view === "reading" ? 560 : 400 }}
      >
        {/* Shelf Header */}
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-3">
          {view === "reading" ? (
            <button
              type="button"
              onClick={closeBook}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted transition-all duration-200 hover:text-ink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              <ArrowLeft size={15} />
              Back to shelf
            </button>
          ) : (
            <h3 className="font-fraunces text-base font-medium text-ink">
              Bookshelf
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted transition-all duration-200 hover:text-ink hover:bg-black/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close bookshelf"
          >
            <X size={16} />
          </button>
        </div>

        {/* Shelf view */}
        {view === "shelf" && (
          <div className="px-5 py-5 max-h-[50vh] overflow-y-auto">
            <div
              className="flex flex-wrap items-end gap-3 pb-2 rounded-xl bg-page-bg/50 ring-1 ring-black/5"
              style={{
                minHeight: 220,
              }}
            >
              {books.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => openBook(book.id)}
                  className="relative flex flex-col items-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-t-md"
                  style={{ height: book.height, width: 44 }}
                  aria-label={`Open ${book.title}`}
                >
                  {/* Book spine */}
                  <div
                    className="flex w-full flex-1 items-center justify-center rounded-t-md overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${book.color}, ${book.color}dd)`,
                    }}
                  >
                    <span
                      className="text-[10px] font-semibold text-white/90 leading-tight select-none"
                      style={{
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        letterSpacing: "0.05em",
                        maxHeight: book.height - 16,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {book.title}
                    </span>
                  </div>
                  {/* Shelf shadow line */}
                  <div className="h-1 w-full rounded-b-sm bg-black/10" />
                </button>
              ))}

              {/* New Book button */}
              <div className="flex flex-col items-center" style={{ height: 120, width: 44 }}>
                {showNewInput ? (
                  <div className="flex flex-col items-center gap-1 w-44 -ml-20">
                    <input
                      type="text"
                      value={newBookInput}
                      onChange={(e) => setNewBookInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addBook()}
                      placeholder="Book name…"
                      autoFocus
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs text-ink outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={addBook}
                        className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-accent-hover active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowNewInput(false); setNewBookInput(""); }}
                        className="rounded-full px-3 py-1 text-xs text-muted transition-all hover:text-ink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowNewInput(true)}
                    className="flex h-full w-full items-center justify-center rounded-t-md border-2 border-dashed border-black/10 bg-white/50 transition-all duration-200 hover:border-accent/40 hover:bg-accent/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Add new book"
                  >
                    <Plus size={18} className="text-muted" />
                  </button>
                )}
                <div className="h-1 w-full rounded-b-sm bg-black/10" />
              </div>
            </div>
          </div>
        )}

        {/* Reading view */}
        {view === "reading" && activeBook && (
          <div className="px-5 py-5 max-h-[55vh] overflow-y-auto">
            <div className="relative mx-auto min-h-[200px] max-w-md">
              {/* Page content with turn animation */}
              <div
                key={displayPage}
                onAnimationEnd={handleAnimEnd}
                className={`${
                  pageAnim === "out"
                    ? "animate-page-flip-out"
                    : pageAnim === "in"
                    ? "animate-page-flip-in"
                    : ""
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "left center",
                }}
              >
                <textarea
                  value={activeBook.pages[displayPage] || ""}
                  onChange={(e) =>
                    updatePageContent(activeBook.id, displayPage, e.target.value)
                  }
                  className="min-h-[180px] w-full resize-none rounded-2xl bg-[#fbfaf7] p-5 text-sm text-ink leading-relaxed outline-none transition-all duration-200 placeholder:text-muted/40 focus:ring-2 focus:ring-accent/20"
                  style={{ fontFamily: "Georgia, serif" }}
                />
              </div>
            </div>

            {/* Page info + nav */}
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => turnPage("prev")}
                disabled={displayPage === 0 || pageAnim !== "none"}
                className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-all duration-200 hover:bg-accent/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
                Prev
              </button>

              <span className="text-xs text-muted font-medium">
                Page {displayPage + 1} of {activeBook.pages.length}
              </span>

              <button
                type="button"
                onClick={() => turnPage("next")}
                disabled={
                  displayPage === activeBook.pages.length - 1 ||
                  pageAnim !== "none"
                }
                className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-all duration-200 hover:bg-accent/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Next page"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
