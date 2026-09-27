import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#' },
  { label: 'How it works', href: '#' },
  { label: 'Integrations', href: '#' },
  { label: 'Pricing', href: '#' },
];

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-4 py-5 sm:px-6 sm:py-6 lg:px-12">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <Link href="/" className="group flex min-h-11 items-center gap-2">
          <LayoutDashboard
            size={24}
            className="text-accent transition-colors group-hover:text-accent-hover"
          />
          <span className="text-[clamp(0.875rem,1.25vw,1.125rem)] font-semibold uppercase tracking-[0.12em] text-ink sm:tracking-[0.15em]">
            DAYSPACE
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[clamp(0.75rem,1vw,0.875rem)] font-medium text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="hidden text-[clamp(0.75rem,1vw,0.875rem)] font-medium text-muted transition-colors hover:text-accent sm:block"
          >
            Log in
          </Link>
          <Link
            href="#"
            className="btn-base inline-flex min-h-11 items-center rounded-full bg-highlight px-4 py-2 text-[clamp(0.75rem,1vw,0.875rem)] font-semibold text-white hover:bg-highlight-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2 sm:px-5"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
