import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import NotepadPanel from '@/app/components/dashboard/NotepadPanel';

describe('NotepadPanel', () => {
  it('renders the scratchpad heading', () => {
    render(<NotepadPanel isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Scratchpad')).toBeInTheDocument();
  });

  it('displays a textarea with placeholder', () => {
    render(<NotepadPanel isOpen={true} onClose={vi.fn()} />);
    expect(
      screen.getByPlaceholderText('Jot something down…')
    ).toBeInTheDocument();
  });

  it('starts with 0 characters', () => {
    render(<NotepadPanel isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('0 characters')).toBeInTheDocument();
  });

  it('updates character count as user types', async () => {
    const user = userEvent.setup();
    render(<NotepadPanel isOpen={true} onClose={vi.fn()} />);

    const textarea = screen.getByPlaceholderText('Jot something down…');
    await user.type(textarea, 'Hello world');

    expect(screen.getByText('11 characters')).toBeInTheDocument();
  });

  it('uses singular for 1 character', async () => {
    const user = userEvent.setup();
    render(<NotepadPanel isOpen={true} onClose={vi.fn()} />);

    const textarea = screen.getByPlaceholderText('Jot something down…');
    await user.type(textarea, 'a');

    expect(screen.getByText('1 character')).toBeInTheDocument();
  });

  it('is hidden when isOpen is false', () => {
    render(<NotepadPanel isOpen={false} onClose={vi.fn()} />);
    const panel = screen.getByText('Scratchpad').closest('[aria-hidden]');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
  });
});
