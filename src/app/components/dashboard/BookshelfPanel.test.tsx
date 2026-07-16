import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookshelfPanel from '@/app/components/dashboard/BookshelfPanel';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

describe('BookshelfPanel', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders the bookshelf heading', async () => {
    render(<BookshelfPanel isOpen={true} onClose={vi.fn()} />);
    expect(
      await screen.findByRole('heading', { name: 'Bookshelf' })
    ).toBeInTheDocument();
  });

  it('displays default sample books on the shelf', async () => {
    render(<BookshelfPanel isOpen={true} onClose={vi.fn()} />);
    expect(await screen.findByText('The Art of Focus')).toBeInTheDocument();
    expect(screen.getByText('Notes on Notes')).toBeInTheDocument();
    expect(screen.getByText('Calendar Zen')).toBeInTheDocument();
  });

  it('shows the add new book button', async () => {
    render(<BookshelfPanel isOpen={true} onClose={vi.fn()} />);
    expect(await screen.findByLabelText('Add new book')).toBeInTheDocument();
  });

  it('opens new book input when clicking add button', async () => {
    const user = userEvent.setup();
    render(<BookshelfPanel isOpen={true} onClose={vi.fn()} />);

    await screen.findByLabelText('Add new book');
    await user.click(screen.getByLabelText('Add new book'));

    expect(screen.getByPlaceholderText('Book name…')).toBeInTheDocument();
  });

  it('adds a new book via Enter key', async () => {
    const user = userEvent.setup();
    render(<BookshelfPanel isOpen={true} onClose={vi.fn()} />);

    await screen.findByLabelText('Add new book');
    await user.click(screen.getByLabelText('Add new book'));

    const input = screen.getByPlaceholderText('Book name…');
    await user.type(input, 'My New Book');
    await user.keyboard('{Enter}');

    expect(screen.getByText('My New Book')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Book name…')).not.toBeInTheDocument();
  });

  it('saves books to localStorage', async () => {
    render(<BookshelfPanel isOpen={true} onClose={vi.fn()} />);
    await screen.findByText('The Art of Focus');

    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('opens a book in reading view when clicked', async () => {
    const user = userEvent.setup();
    render(<BookshelfPanel isOpen={true} onClose={vi.fn()} />);

    await screen.findByText('The Art of Focus');
    await user.click(screen.getByLabelText('Open The Art of Focus'));

    expect(screen.getByText('Back to shelf')).toBeInTheDocument();
  });

  it('navigates back to shelf from reading view', async () => {
    const user = userEvent.setup();
    render(<BookshelfPanel isOpen={true} onClose={vi.fn()} />);

    await screen.findByText('The Art of Focus');
    await user.click(screen.getByLabelText('Open The Art of Focus'));
    await user.click(screen.getByText('Back to shelf'));

    expect(
      screen.getByRole('heading', { name: 'Bookshelf' })
    ).toBeInTheDocument();
  });

  it('is hidden when isOpen is false', () => {
    const { container } = render(
      <BookshelfPanel isOpen={false} onClose={vi.fn()} />
    );
    const outerDiv = container.firstElementChild;
    expect(outerDiv).toHaveAttribute('aria-hidden', 'true');
  });
});
