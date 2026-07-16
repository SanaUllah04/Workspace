import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TasksPanel from '@/app/components/dashboard/TasksPanel';

describe('TasksPanel', () => {
  it('renders the tasks heading', () => {
    render(<TasksPanel isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Tasks & Reminders')).toBeInTheDocument();
  });

  it('displays initial tasks', () => {
    render(<TasksPanel isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Review PR #142')).toBeInTheDocument();
    expect(screen.getByText('Write release notes')).toBeInTheDocument();
    expect(screen.getByText('Prep for standup')).toBeInTheDocument();
  });

  it('shows progress bar', () => {
    render(<TasksPanel isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('adds a new task when typing and pressing Enter', async () => {
    const user = userEvent.setup();
    render(<TasksPanel isOpen={true} onClose={vi.fn()} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await user.type(input, 'New task item');
    await user.keyboard('{Enter}');

    expect(screen.getByText('New task item')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('adds a new task when clicking the add button', async () => {
    const user = userEvent.setup();
    render(<TasksPanel isOpen={true} onClose={vi.fn()} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await user.type(input, 'Button added task');
    await user.click(screen.getByLabelText('Add task'));

    expect(screen.getByText('Button added task')).toBeInTheDocument();
  });

  it('does not add empty tasks', async () => {
    const user = userEvent.setup();
    render(<TasksPanel isOpen={true} onClose={vi.fn()} />);

    await user.click(screen.getByLabelText('Add task'));

    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('toggles task completion', async () => {
    const user = userEvent.setup();
    render(<TasksPanel isOpen={true} onClose={vi.fn()} />);

    const taskItem = screen.getByText('Prep for standup');
    expect(taskItem.className).not.toContain('line-through');

    const toggleBtn = screen.getByLabelText('Mark as done');
    await user.click(toggleBtn);

    expect(taskItem.className).toContain('line-through');
  });

  it('deletes a task', async () => {
    const user = userEvent.setup();
    render(<TasksPanel isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Review PR #142')).toBeInTheDocument();

    const deleteBtn = screen.getByLabelText('Delete Review PR #142');
    await user.click(deleteBtn);

    expect(screen.queryByText('Review PR #142')).not.toBeInTheDocument();
  });

  it('updates progress after toggling', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TasksPanel isOpen={true} onClose={vi.fn()} />
    );

    expect(container.textContent).toContain('2/3');

    const doneBtns = screen.getAllByLabelText('Mark as done');
    await user.click(doneBtns[0]);

    expect(container.textContent).toContain('3/3');
  });

  it('is hidden when isOpen is false', () => {
    render(<TasksPanel isOpen={false} onClose={vi.fn()} />);
    const panel = screen
      .getByText('Tasks & Reminders')
      .closest('[aria-hidden]');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
  });
});
