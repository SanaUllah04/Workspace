import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navbar from '@/app/components/hero/Navbar';

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(<Navbar />);
    expect(screen.getByText('DAYSPACE')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getByText('Integrations')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('renders the Get Started button', () => {
    render(<Navbar />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders the Log in link', () => {
    render(<Navbar />);
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  it('has correct link to home page', () => {
    render(<Navbar />);
    const logoLink = screen.getByText('DAYSPACE').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
