import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotepadWidgetCard from '@/app/components/hero/NotepadWidgetCard';

describe('NotepadWidgetCard', () => {
  it('renders the scratchpad heading', () => {
    render(<NotepadWidgetCard />);
    expect(screen.getByText('Scratchpad')).toBeInTheDocument();
  });

  it('displays the placeholder quote', () => {
    render(<NotepadWidgetCard />);
    expect(screen.getByText(/Review quarterly goals/)).toBeInTheDocument();
  });
});
