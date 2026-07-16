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
    <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 lg:px-12">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <LayoutDashboard
            size={26}
            className="text-accent transition-colors group-hover:text-accent-hover"
          />
          <span className="text-lg font-semibold uppercase tracking-[0.15em] text-ink">
            DAYSPACE
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="hidden text-sm font-medium text-muted transition-colors hover:text-accent sm:block"
          >
            Log in
          </Link>
          <Link
            href="#"
            className="btn-base rounded-full bg-highlight px-5 py-2 text-sm font-semibold text-white hover:bg-highlight-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
