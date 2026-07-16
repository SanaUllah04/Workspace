import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import DashboardPage from '@/app/dashboard/page';

const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });

describe('DashboardPage', () => {
  it('renders all toggle buttons', () => {
    render(<DashboardPage />);
    expect(screen.getByLabelText('Toggle calendar panel')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle tasks panel')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle notepad')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle bookshelf')).toBeInTheDocument();
  });

  it('toggles calendar panel open and closed', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await user.click(screen.getByLabelText('Toggle calendar panel'));
    expect(screen.getByText(new RegExp(currentMonth))).toBeInTheDocument();

    await user.click(screen.getByLabelText('Toggle calendar panel'));
    const calPanel = screen
      .getByText(new RegExp(currentMonth))
      .closest('[aria-hidden]');
    expect(calPanel).toHaveAttribute('aria-hidden', 'true');
  });

  it('toggles tasks panel', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await user.click(screen.getByLabelText('Toggle tasks panel'));
    expect(screen.getByText('Tasks & Reminders')).toBeInTheDocument();
  });

  it('toggles notepad panel', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await user.click(screen.getByLabelText('Toggle notepad'));
    expect(screen.getByText('Scratchpad')).toBeInTheDocument();
  });

  it('toggles bookshelf panel', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await user.click(screen.getByLabelText('Toggle bookshelf'));
    expect(
      screen.getByRole('heading', { name: 'Bookshelf' })
    ).toBeInTheDocument();
  });

  it('closes one panel when opening another', async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await user.click(screen.getByLabelText('Toggle calendar panel'));
    expect(screen.getByText(new RegExp(currentMonth))).toBeInTheDocument();

    await user.click(screen.getByLabelText('Toggle tasks panel'));
    expect(screen.getByText('Tasks & Reminders')).toBeInTheDocument();

    const calPanel = screen
      .getByText(new RegExp(currentMonth))
      .closest('[aria-hidden]');
    expect(calPanel).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows correct toggle labels', () => {
    const { container } = render(<DashboardPage />);
    expect(container.textContent).toContain('Calendar');
    expect(container.textContent).toContain('Tasks');
    expect(container.textContent).toContain('Notepad');
    expect(container.textContent).toContain('Bookshelf');
  });
});
