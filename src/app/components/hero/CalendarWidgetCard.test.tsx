import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CalendarWidgetCard from '@/app/components/hero/CalendarWidgetCard';

describe('CalendarWidgetCard', () => {
  it('renders the calendar heading', () => {
    render(<CalendarWidgetCard />);
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  it('displays the event title', () => {
    render(<CalendarWidgetCard />);
    expect(screen.getByText('Sprint Review')).toBeInTheDocument();
  });

  it('displays the event time', () => {
    render(<CalendarWidgetCard />);
    expect(screen.getByText('3:00 PM – 4:00 PM')).toBeInTheDocument();
  });

  it('shows the current day number', () => {
    render(<CalendarWidgetCard />);
    const today = new Date().getDate();
    expect(screen.getByText(today.toString())).toBeInTheDocument();
  });

  it('shows the current month abbreviation', () => {
    render(<CalendarWidgetCard />);
    const monthAbbr = new Date().toLocaleDateString('en-US', {
      month: 'short',
    });
    expect(screen.getByText(monthAbbr)).toBeInTheDocument();
  });
});
