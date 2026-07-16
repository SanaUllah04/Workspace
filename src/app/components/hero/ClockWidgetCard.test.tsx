import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ClockWidgetCard from '@/app/components/hero/ClockWidgetCard';

describe('ClockWidgetCard', () => {
  it('renders the clock heading', () => {
    render(<ClockWidgetCard />);
    expect(screen.getByText('Live Clock')).toBeInTheDocument();
  });

  it('displays the default location', () => {
    render(<ClockWidgetCard />);
    expect(screen.getByText('Peshawar, PK')).toBeInTheDocument();
  });

  it('displays the default temperature', () => {
    render(<ClockWidgetCard />);
    expect(screen.getByText('31°C')).toBeInTheDocument();
  });

  it('accepts custom location and temperature props', () => {
    render(<ClockWidgetCard location="London, UK" temperature="18°C" />);
    expect(screen.getByText('London, UK')).toBeInTheDocument();
    expect(screen.getByText('18°C')).toBeInTheDocument();
  });

  it('displays time after mount', () => {
    render(<ClockWidgetCard />);
    const timeRegex = /\d{2}:\d{2}:\d{2}/;
    expect(screen.getByText(timeRegex)).toBeInTheDocument();
  });
});
