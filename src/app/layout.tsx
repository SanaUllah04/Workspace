import type { Metadata } from 'next';
import { Fraunces, Inter, EB_Garamond } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DAYSPACE — One quiet place for your whole day',
  description:
    'Notes, tasks, reminders, your calendar, and the moment — clock, weather, and location — all living together on a single dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${ebGaramond.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
