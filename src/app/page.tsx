import Link from 'next/link';
import { ArrowRight, Shield, Globe, Sparkles } from 'lucide-react';
import Navbar from '@/app/components/hero/Navbar';
import ClockWidgetCard from '@/app/components/hero/ClockWidgetCard';
import NotepadWidgetCard from '@/app/components/hero/NotepadWidgetCard';
import TasksWidgetCard from '@/app/components/hero/TasksWidgetCard';
import CalendarWidgetCard from '@/app/components/hero/CalendarWidgetCard';

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-[1440px]">
        <div
          className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-black/5 md:min-h-[calc(100vh-3rem)] md:rounded-[40px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(61,90,128,0.04) 0%, transparent 70%), #ffffff',
          }}
        >
          <Navbar />

          <main className="relative z-10 flex min-h-[calc(100vh-2rem)] flex-col items-center justify-center px-4 md:min-h-[calc(100vh-3rem)] md:px-8">
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center -mt-10">
              <p className="animate-fade-slide-up text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Your day, in one place
              </p>

              <h1 className="animate-fade-slide-up-1 mt-5 font-fraunces text-4xl font-medium leading-[1.05] tracking-tight text-ink md:text-5xl lg:text-6xl">
                One quiet place for your whole day.
              </h1>

              <p className="animate-fade-slide-up-2 mt-5 max-w-lg text-lg text-muted md:text-xl">
                Notes, tasks, reminders, your calendar, and the moment — clock,
                weather, and location — all living together on a single
                dashboard.
              </p>

              <div className="animate-fade-slide-up-3 mt-8 flex flex-col items-center gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="btn-base group inline-flex items-center gap-2 rounded-full bg-highlight px-7 py-3 text-sm font-semibold text-white hover:bg-highlight-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight focus-visible:ring-offset-2"
                >
                  Enter Workspace
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="#"
                  className="btn-base inline-flex items-center gap-2 rounded-full border border-black/10 px-7 py-3 text-sm font-semibold text-ink hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  See how it works
                </Link>
              </div>
            </div>

            <div
              className="relative mt-16 hidden w-full max-w-2xl md:block"
              style={{ height: 260 }}
            >
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

            <div className="mt-12 grid w-full max-w-lg grid-cols-1 gap-4 md:hidden">
              <ClockWidgetCard />
              <NotepadWidgetCard />
              <TasksWidgetCard />
              <CalendarWidgetCard />
            </div>
          </main>

          <div className="absolute bottom-0 left-0 right-0 z-10 hidden border-t border-black/5 bg-white/60 backdrop-blur-sm md:block">
            <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-10 px-12 py-4">
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
