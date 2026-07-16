import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '@/app/login/page';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the DAYSPACE brand', () => {
    render(<LoginPage />);
    expect(screen.getByText('DAYSPACE')).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('pre-fills demo credentials', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Email')).toHaveValue('demo@dayspace.app');
    expect(screen.getByLabelText('Password')).toHaveValue('dayspace123');
  });

  it('renders the Log In button', () => {
    render(<LoginPage />);
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('shows error for wrong credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'wrong@email.com');
    await user.click(screen.getByText('Log In'));

    expect(
      screen.getByText('Invalid email or password. Try the demo credentials.')
    ).toBeInTheDocument();
  });

  it('shows welcome message on successful login', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByText('Log In'));

    await waitFor(() => {
      expect(
        screen.getByText(/This workspace belongs to you/)
      ).toBeInTheDocument();
    });
  });

  it('redirects to dashboard after successful login', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<LoginPage />);

    await user.click(screen.getByText('Log In'));

    vi.advanceTimersByTime(2500);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    vi.useRealTimers();
  });

  it('shows demo credentials hint', () => {
    render(<LoginPage />);
    expect(
      screen.getByText('Demo credentials are pre-filled — just hit Log In.')
    ).toBeInTheDocument();
  });
});
