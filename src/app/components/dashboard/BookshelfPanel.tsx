'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronLeft, ChevronRight, ArrowLeft, Plus, X } from 'lucide-react';

const STORAGE_KEY = 'dayspace-bookshelf';

interface Book {
  id: string;
  title: string;
  pages: string[];
  currentPage: number;
  color: string;
  height: number;
  width: number;
  onShelf: boolean;
}

const SPINE_COLORS = [
  '#3d5a80',
  '#ee6c4d',
  '#1b2430',
  '#4a5568',
  '#2f4666',
  '#e85d3d',
  '#5a7a9e',
  '#f08c70',
  '#2c3a4a',
  '#3d5a80',
  '#ee6c4d',
  '#1b2430',
  '#5a7a9e',
  '#e85d3d',
  '#4a5568',
];

const RIBBON_COLORS = ['#ee6c4d', '#e85d3d', '#f08c70', '#3d5a80', '#5a7a9e'];

function createSampleBooks(): Book[] {
  return [
    {
      id: 'b1',
      title: 'The Art of Focus',
      pages: [
        'In a world of endless distractions, the ability to focus deeply has become a superpower.\n\nThis is the premise upon which our entire workspace is built. Not to do more, but to do what matters.\n\nThe quiet mind is not empty — it is fully engaged with the present task.',
        'Deep work cannot be rushed. It requires rituals, boundaries, and a space that protects attention.\n\nYour digital environment should feel like a calm room with a single desk, not a crowded marketplace.\n\nEvery notification is a tax on your attention. Choose wisely what you allow through.',
        "The most productive people don't manage time — they manage attention.\n\nTime is fixed. Attention is variable. Protect it fiercely.\n\nBuild systems, not habits. Systems scale. Habits fade under pressure.",
        'The ability to concentrate without distraction on a cognitively demanding task is a skill that requires training.\n\nLike any skill, it must be practiced deliberately and consistently to improve.',
      ],
      currentPage: 0,
      color: SPINE_COLORS[0],
      height: 180,
      width: 28,
      onShelf: true,
    },
    {
      id: 'b2',
      title: 'Notes on Notes',
      pages: [
        'The simple act of writing something down changes how you think about it.\n\nNotes are not just memory aids. They are thinking tools. When you write, you externalize your thoughts and can examine them from a distance.',
        'Good note-taking is not about capturing everything. It is about capturing what matters.\n\nAsk yourself: will I care about this tomorrow? Next week? Next year?\n\nIf the answer is no, let it go.',
      ],
      currentPage: 0,
      color: SPINE_COLORS[1],
      height: 160,
      width: 24,
      onShelf: true,
    },
    {
      id: 'b3',
      title: 'Calendar Zen',
      pages: [
        "Your calendar should feel like a garden, not a grid.\n\nBlock time for the important stuff first. Let the urgent fill what's left.\n\nIf everything is urgent, nothing is.",
        "Time blocking is the single most effective productivity technique.\n\nAssign every hour a job. Protect those hours like appointments with yourself.\n\nBecause that's exactly what they are.",
      ],
      currentPage: 0,
      color: SPINE_COLORS[2],
      height: 200,
      width: 24,
      onShelf: true,
    },
  ];
}

function loadBooks(): Book[] {
  if (typeof window === 'undefined') return createSampleBooks();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return createSampleBooks();
}

function saveBooks(books: Book[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch {}
}

function spineTextColor(bgColor: string): string {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 140 ? '#1b2430' : '#ffffff';
}

function DraggableBook({ book, onClick }: { book: Book; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: book.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: book.height,
    width: book.width,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        type="button"
        onClick={onClick}
        className="btn-base relative flex flex-col items-center h-full w-full hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-t-sm"
        aria-label={`Open ${book.title}`}
      >
        {/* Bookmark ribbon */}
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10"
          style={{ width: book.width * 0.45, height: 8 }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 20 12"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0h20v8l-4 4-6-4-6 4-4-4V0z"
              fill={RIBBON_COLORS[book.id.length % RIBBON_COLORS.length]}
              opacity={0.85}
            />
          </svg>
        </div>

        {/* Spine */}
        <div
          className="flex w-full flex-1 items-center justify-center rounded-t-sm overflow-hidden shadow-[2px_0_4px_rgba(0,0,0,0.1),-1px_0_2px_rgba(0,0,0,0.05)]"
          style={{
            background: `linear-gradient(135deg, ${book.color}, ${book.color}dd)`,
          }}
        >
          {/* Decorative lines near top/bottom */}
          <div className="absolute top-1 left-1 right-1 h-[2px] rounded-full bg-white/20" />
          <div className="absolute bottom-1 left-1 right-1 h-[2px] rounded-full bg-white/20" />

          <span
            className="text-[10px] font-semibold leading-tight select-none"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              letterSpacing: '0.05em',
              maxHeight: book.height - 20,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: spineTextColor(book.color),
            }}
          >
            {book.title}
          </span>
        </div>

        {/* Shelf shadow */}
        <div className="h-1 w-full rounded-b-sm bg-black/10" />
      </button>
    </div>
  );
}

export default function BookshelfPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<'shelf' | 'reading'>('shelf');
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [newBookInput, setNewBookInput] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pageAnim, setPageAnim] = useState<'none' | 'out' | 'in'>('none');
  const [displayPage, setDisplayPage] = useState(0);
  const [pendingDir, setPendingDir] = useState<'prev' | 'next' | null>(null);

  useEffect(() => {
    const b = loadBooks();
    setBooks(b);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveBooks(books);
  }, [books, loaded]);

  const shelfBooks = useMemo(() => books.filter((b) => b.onShelf), [books]);
  const deskBooks = useMemo(() => books.filter((b) => !b.onShelf), [books]);

  const activeBook = activeBookId
    ? books.find((b) => b.id === activeBookId)
    : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    if (activeIdStr === overIdStr) return;

    // Determine target container from the over item or drop zone
    const overBook = books.find((b) => b.id === overIdStr);
    const activeBook = books.find((b) => b.id === activeIdStr);
    if (!activeBook) return;

    // Check if dropped on desk area (the desk zone id)
    if (overIdStr === 'desk-zone') {
      setBooks((prev) =>
        prev.map((b) => (b.id === activeIdStr ? { ...b, onShelf: false } : b))
      );
      return;
    }

    // Check if dropped on shelf area
    if (overIdStr === 'shelf-zone') {
      setBooks((prev) =>
        prev.map((b) => (b.id === activeIdStr ? { ...b, onShelf: true } : b))
      );
      return;
    }

    // Reorder within same container or between containers
    setBooks((prev) => {
      const activeIdx = prev.findIndex((b) => b.id === activeIdStr);
      const overIdx = prev.findIndex((b) => b.id === overIdStr);
      if (activeIdx === -1 || overIdx === -1) return prev;

      // If moving between shelf and desk, toggle onShelf
      const activeB = prev[activeIdx];
      const overB = prev[overIdx];
      if (activeB.onShelf !== overB.onShelf) {
        return prev.map((b) =>
          b.id === activeIdStr ? { ...b, onShelf: overB.onShelf } : b
        );
      }

      // Reorder within same container
      const newBooks = [...prev];
      const [moved] = newBooks.splice(activeIdx, 1);
      newBooks.splice(overIdx, 0, moved);
      return newBooks;
    });
  }

  function openBook(bookId: string) {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;
    setActiveBookId(bookId);
    setDisplayPage(book.currentPage);
    setPageAnim('none');
    setView('reading');
  }

  function closeBook() {
    setView('shelf');
    setActiveBookId(null);
    setPageAnim('none');
  }

  const turnPage = useCallback(
    (dir: 'prev' | 'next') => {
      if (!activeBook || pageAnim !== 'none') return;
      const book = books.find((b) => b.id === activeBookId);
      if (!book) return;
      const nextPage =
        dir === 'next'
          ? Math.min(book.currentPage + 2, book.pages.length - 1)
          : Math.max(book.currentPage - 2, 0);
      if (nextPage === book.currentPage) return;
      setPendingDir(dir);
      setPageAnim('out');
    },
    [activeBook, activeBookId, books, pageAnim]
  );

  function handleAnimEnd() {
    if (pageAnim === 'out' && activeBookId && pendingDir) {
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id !== activeBookId) return b;
          const next =
            pendingDir === 'next'
              ? Math.min(b.currentPage + 2, b.pages.length - 1)
              : Math.max(b.currentPage - 2, 0);
          return { ...b, currentPage: next };
        })
      );
      setDisplayPage((prev) => {
        const book = books.find((b) => b.id === activeBookId);
        if (!book) return prev;
        return pendingDir === 'next'
          ? Math.min(prev + 2, book.pages.length - 1)
          : Math.max(prev - 2, 0);
      });
      setPendingDir(null);
      setPageAnim('in');
    } else if (pageAnim === 'in') {
      setPageAnim('none');
    }
  }

  function addBook() {
    const trimmed = newBookInput.trim();
    if (!trimmed) return;
    const newBook: Book = {
      id: crypto.randomUUID(),
      title: trimmed,
      pages: ['Start writing…'],
      currentPage: 0,
      color: SPINE_COLORS[books.length % SPINE_COLORS.length],
      height: 140 + Math.floor(Math.random() * 70),
      width: 22 + Math.floor(Math.random() * 14),
      onShelf: true,
    };
    setBooks((prev) => [...prev, newBook]);
    setNewBookInput('');
    setShowNewInput(false);
  }

  function updatePageContent(
    bookId: string,
    pageIndex: number,
    side: 'left' | 'right',
    text: string
  ) {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const newPages = [...b.pages];
        const targetIdx =
          side === 'left'
            ? pageIndex
            : Math.min(pageIndex + 1, b.pages.length - 1);
        newPages[targetIdx] = text;
        return { ...b, pages: newPages };
      })
    );
  }

  if (!loaded) return null;

  return (
    <div
      aria-hidden={!isOpen}
      className={`absolute bottom-0 left-0 z-20 transition-all duration-300 ease-out ${
        isOpen
          ? 'translate-x-0 opacity-100'
          : '-translate-x-full opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="rounded-tr-[28px] rounded-br-[28px] bg-surface shadow-lg ring-1 ring-black/5 overflow-hidden"
        style={{ maxWidth: '90vw', width: view === 'reading' ? 600 : 420 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-3">
          {view === 'reading' ? (
            <button
              type="button"
              onClick={closeBook}
              className="btn-base flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
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
            className="btn-base rounded-full p-1.5 text-muted hover:text-ink hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Close bookshelf"
          >
            <X size={16} />
          </button>
        </div>

        {/* Shelf view */}
        {view === 'shelf' && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="px-5 py-5 pb-16 max-h-[65vh] overflow-y-auto">
              {/* Desk area */}
              {deskBooks.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-2">
                    On Desk
                  </p>
                  <SortableContext
                    items={deskBooks.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div
                      id="desk-zone"
                      className="flex flex-wrap items-end gap-3 p-3 rounded-xl bg-page-bg/50 ring-1 ring-black/5 min-h-[80px]"
                    >
                      {deskBooks.map((book) => (
                        <DraggableBook
                          key={book.id}
                          book={book}
                          onClick={() => openBook(book.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              )}

              {/* Shelf */}
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-2">
                Bookshelf
              </p>
              <SortableContext
                items={shelfBooks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div
                  id="shelf-zone"
                  className="flex flex-wrap items-end gap-3 pb-1 rounded-xl bg-page-bg/50 ring-1 ring-black/5 px-4 pt-6"
                  style={{
                    minHeight: 220,
                    background:
                      'linear-gradient(180deg, #f5f4f1 0%, #f5f4f1 60%, #d4a373 60%, #c4956a 64%, #b8885e 100%)',
                  }}
                >
                  {shelfBooks.map((book) => (
                    <DraggableBook
                      key={book.id}
                      book={book}
                      onClick={() => openBook(book.id)}
                    />
                  ))}

                  {/* New Book button */}
                  <div
                    className="flex flex-col items-center justify-end"
                    style={{ height: 120, width: 44 }}
                  >
                    {showNewInput ? (
                      <div className="flex flex-col items-center gap-1 w-44 mb-8">
                        <input
                          type="text"
                          value={newBookInput}
                          onChange={(e) => setNewBookInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addBook()}
                          placeholder="Book name…"
                          autoFocus
                          className="w-full rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs text-ink outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                        />
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={addBook}
                            className="btn-base rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewInput(false);
                              setNewBookInput('');
                            }}
                            className="btn-base rounded-full px-3 py-1 text-xs text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowNewInput(true)}
                        className="btn-base flex h-full w-full items-center justify-center rounded-t-md border-2 border-dashed border-black/10 bg-white/50 hover:border-accent/40 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        aria-label="Add new book"
                      >
                        <Plus size={18} className="text-muted" />
                      </button>
                    )}
                    <div className="h-1 w-full rounded-b-sm bg-black/10" />
                  </div>
                </div>
              </SortableContext>
            </div>
          </DndContext>
        )}

        {/* Reading view — two-page spread */}
        {view === 'reading' && activeBook && (
          <div className="px-5 py-5 pb-16 max-h-[70vh] overflow-y-auto">
            <div
              key={displayPage}
              onAnimationEnd={handleAnimEnd}
              className={`${
                pageAnim === 'out'
                  ? 'animate-page-flip-out'
                  : pageAnim === 'in'
                    ? 'animate-page-flip-in'
                    : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
              }}
            >
              {/* Two-page spread */}
              <div
                className="relative flex rounded-xl overflow-hidden min-h-[280px] shadow-sm ring-1 ring-black/5"
                style={{
                  background: '#f5f0e8',
                }}
              >
                {/* Left page */}
                <div
                  className="relative w-1/2 p-5"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      transparent, transparent 23px,
                      rgba(0,0,0,0.06) 23px, rgba(0,0,0,0.06) 24px
                    )`,
                    backgroundPosition: '0 12px',
                  }}
                >
                  <textarea
                    value={activeBook.pages[displayPage] || ''}
                    onChange={(e) =>
                      updatePageContent(
                        activeBook.id,
                        displayPage,
                        'left',
                        e.target.value
                      )
                    }
                    className="w-full h-full min-h-[250px] resize-none bg-transparent text-sm leading-[24px] outline-none"
                    style={{
                      fontFamily: 'var(--font-eb-garamond), Georgia, serif',
                      color: '#2c1810',
                    }}
                  />
                </div>

                {/* Center gutter */}
                <div className="w-[2px] shrink-0 bg-gradient-to-b from-black/5 via-black/15 to-black/5" />

                {/* Right page */}
                <div
                  className="relative w-1/2 p-5"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      transparent, transparent 23px,
                      rgba(0,0,0,0.06) 23px, rgba(0,0,0,0.06) 24px
                    )`,
                    backgroundPosition: '0 12px',
                  }}
                >
                  <textarea
                    value={activeBook.pages[displayPage + 1] || ''}
                    onChange={(e) =>
                      updatePageContent(
                        activeBook.id,
                        displayPage,
                        'right',
                        e.target.value
                      )
                    }
                    className="w-full h-full min-h-[250px] resize-none bg-transparent text-sm leading-[24px] outline-none"
                    style={{
                      fontFamily: 'var(--font-eb-garamond), Georgia, serif',
                      color: '#2c1810',
                    }}
                    placeholder={
                      displayPage + 1 >= activeBook.pages.length ? '—' : ''
                    }
                    disabled={displayPage + 1 >= activeBook.pages.length}
                  />
                </div>
              </div>
            </div>

            {/* Page nav */}
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => turnPage('prev')}
                disabled={displayPage === 0 || pageAnim !== 'none'}
                className="btn-base flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Previous spread"
              >
                <ChevronLeft size={14} />
                Prev
              </button>

              <span className="text-xs text-muted font-medium">
                Spread {Math.floor(displayPage / 2) + 1} of{' '}
                {Math.ceil(activeBook.pages.length / 2)}
              </span>

              <button
                type="button"
                onClick={() => turnPage('next')}
                disabled={
                  displayPage >= activeBook.pages.length - 2 ||
                  pageAnim !== 'none'
                }
                className="btn-base flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-30 disabled:pointer-events-none"
                aria-label="Next spread"
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
