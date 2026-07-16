import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TasksWidgetCard from '@/app/components/hero/TasksWidgetCard';

describe('TasksWidgetCard', () => {
  it('renders the tasks heading', () => {
    render(<TasksWidgetCard />);
    expect(screen.getByText("Today's Tasks")).toBeInTheDocument();
  });

  it('displays all task items', () => {
    render(<TasksWidgetCard />);
    expect(screen.getByText('Review PR #142')).toBeInTheDocument();
    expect(screen.getByText('Write release notes')).toBeInTheDocument();
    expect(screen.getByText('Prep for standup')).toBeInTheDocument();
  });

  it('shows progress count', () => {
    render(<TasksWidgetCard />);
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('marks completed tasks with line-through style', () => {
    render(<TasksWidgetCard />);
    const doneTask = screen.getByText('Review PR #142');
    expect(doneTask.className).toContain('line-through');
  });

  it('marks incomplete tasks without line-through', () => {
    render(<TasksWidgetCard />);
    const undoneTask = screen.getByText('Prep for standup');
    expect(undoneTask.className).not.toContain('line-through');
  });
});
