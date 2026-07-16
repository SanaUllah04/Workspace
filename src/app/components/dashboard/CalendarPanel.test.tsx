import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CalendarPanel from '@/app/components/dashboard/CalendarPanel';

describe('CalendarPanel', () => {
  it('renders the current month and year', () => {
    render(<CalendarPanel isOpen={true} onClose={vi.fn()} />);
    const now = new Date();
    const monthName = now.toLocaleDateString('en-US', { month: 'long' });
    const year = now.getFullYear().toString();
    expect(screen.getByText(`${monthName} ${year}`)).toBeInTheDocument();
  });

  it('renders weekday headers', () => {
    render(<CalendarPanel isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('highlights today', () => {
    render(<CalendarPanel isOpen={true} onClose={vi.fn()} />);
    const today = new Date().getDate();
    const todayButton = screen.getByText(today.toString());
    expect(todayButton.className).toContain('bg-highlight');
  });

  it('navigates to the next month', async () => {
    const user = userEvent.setup();
    render(<CalendarPanel isOpen={true} onClose={vi.fn()} />);

    const now = new Date();
    const nextMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
    const nextMonthName = new Date(
      now.getFullYear(),
      nextMonth
    ).toLocaleDateString('en-US', { month: 'long' });

    await user.click(screen.getByLabelText('Next month'));

    expect(screen.getByText(new RegExp(nextMonthName))).toBeInTheDocument();
  });

  it('navigates to the previous month', async () => {
    const user = userEvent.setup();
    render(<CalendarPanel isOpen={true} onClose={vi.fn()} />);

    const now = new Date();
    const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const prevMonthName = new Date(
      now.getFullYear(),
      prevMonth
    ).toLocaleDateString('en-US', { month: 'long' });

    await user.click(screen.getByLabelText('Previous month'));

    expect(screen.getByText(new RegExp(prevMonthName))).toBeInTheDocument();
  });

  it('renders 42 calendar cells (6 rows)', () => {
    render(<CalendarPanel isOpen={true} onClose={vi.fn()} />);
    const grid = screen.getByText('Sun').closest('.grid');
    const buttons = within(grid!).getAllByRole('button');
    expect(buttons.length).toBe(42);
  });

  it('renders the Google Calendar button', () => {
    render(<CalendarPanel isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Connect Google Calendar')).toBeInTheDocument();
  });

  it('is hidden when isOpen is false', () => {
    render(<CalendarPanel isOpen={false} onClose={vi.fn()} />);
    const now = new Date();
    const monthName = now.toLocaleDateString('en-US', { month: 'long' });
    const panel = screen
      .getByText(new RegExp(monthName))
      .closest('[aria-hidden]');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
  });
});
