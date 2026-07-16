import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TimeLocationWeather from '@/app/components/dashboard/TimeLocationWeather';

describe('TimeLocationWeather', () => {
  it('renders the default location', () => {
    const { container } = render(<TimeLocationWeather />);
    expect(container.textContent).toContain('Peshawar, PK');
  });

  it('renders the default temperature', () => {
    const { container } = render(<TimeLocationWeather />);
    expect(container.textContent).toContain('31°C');
  });

  it('accepts custom props', () => {
    const { container } = render(
      <TimeLocationWeather location="New York, US" temperature="22°C" />
    );
    expect(container.textContent).toContain('New York, US');
    expect(container.textContent).toContain('22°C');
  });

  it('displays the CloudSun icon', () => {
    render(<TimeLocationWeather />);
    const svgs = document.querySelectorAll('.lucide-cloud-sun');
    expect(svgs.length).toBeGreaterThan(0);
  });
});
