import Link from 'next/link';
import { ArrowRight, Shield, Globe, Sparkles } from 'lucide-react';
import Navbar from '@/app/components/hero/Navbar';
import ClockWidgetCard from '@/app/components/hero/ClockWidgetCard';
import NotepadWidgetCard from '@/app/components/hero/NotepadWidgetCard';
import TasksWidgetCard from '@/app/components/hero/TasksWidgetCard';
import CalendarWidgetCard from '@/app/components/hero/CalendarWidgetCard';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="w-full">
        <div
          className="relative flex min-h-[100svh] flex-col overflow-hidden bg-white"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(61,90,128,0.04) 0%, transparent 70%), #ffffff',
          }}
        >
          <Navbar />

          <main className="landing-main relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-8 pt-28 sm:px-6 md:px-8 md:pt-24">
            <div className="landing-hero mx-auto flex max-w-2xl flex-col items-center text-center md:-mt-10">
              <p className="animate-fade-slide-up text-[clamp(0.625rem,0.8vw,0.75rem)] font-semibold uppercase tracking-[0.2em] text-accent">
                Your day, in one place
              </p>

              <h1 className="animate-fade-slide-up-1 mt-6 font-fraunces text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-tight text-ink">
                One quiet place for your whole day.
              </h1>

              <p className="animate-fade-slide-up-2 mt-6 max-w-lg text-[clamp(1rem,1.6vw,1.25rem)] leading-relaxed text-muted">
                Notes, tasks, reminders, your calendar, and the moment — clock,
                weather, and location — all living together on a single
                dashboard.
              </p>

              <div className="animate-fade-slide-up-3 mt-6 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/login"
                  className="btn-base group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-highlight px-7 py-3 text-[clamp(0.75rem,1vw,0.875rem)] font-semibold text-white hover:bg-highlight-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2"
                >
                  Enter Workspace
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="#"
                  className="btn-base inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/10 px-7 py-3 text-[clamp(0.75rem,1vw,0.875rem)] font-semibold text-ink hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  See how it works
                </Link>
              </div>
            </div>

            <div className="relative mt-16 hidden h-[clamp(16rem,28vw,34rem)] w-[min(92vw,1100px)] lg:block">
              <div className="animate-fade-slide-up-4 animate-float absolute -top-4 left-[2%] rotate-[-3deg] lg:left-[8%]">
                <ClockWidgetCard />
              </div>
              <div className="animate-fade-slide-up-5 animate-float-delayed-1 absolute top-12 right-[4%] rotate-[2deg] lg:right-[10%]">
                <NotepadWidgetCard />
              </div>
              <div className="animate-fade-slide-up-3 animate-float-delayed-2 absolute -bottom-2 left-[18%] rotate-[-1deg] lg:left-[22%]">
                <TasksWidgetCard />
              </div>
              <div className="animate-fade-slide-up-4 animate-float-delayed-3 absolute -bottom-4 right-[10%] rotate-[3deg] lg:right-[14%]">
                <CalendarWidgetCard />
              </div>
            </div>

            <div className="landing-widget-grid mt-12 grid w-full grid-cols-2 gap-3 lg:hidden">
              <ClockWidgetCard />
              <NotepadWidgetCard />
              <TasksWidgetCard />
              <CalendarWidgetCard />
            </div>
          </main>

          <div className="landing-badges relative z-10 border-t border-black/5 bg-white/60 backdrop-blur-sm md:absolute md:bottom-0 md:left-0 md:right-0">
            <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-4 sm:gap-x-10 md:px-12">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Shield size={14} className="text-accent" />
                <span>Private by default</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Globe size={14} className="text-accent" />
                <span>Syncs everywhere</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <Sparkles size={14} className="text-accent" />
                <span>Free to start</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
