'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; text: string };
type RecognitionResult = { 0: { transcript: string } };
type RecognitionEvent = { results: ArrayLike<RecognitionResult> };
type Recognition = {
  lang: string;
  onresult: ((event: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

export default function DaveAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechBlocked, setSpeechBlocked] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const greetedRef = useRef(false);

  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    void askDave(
      'Give me a brief spoken welcome and summarize the latest available dashboard information.',
      [],
      true
    );
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
    // This is intentionally a single greeting for each dashboard visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  function speak(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      setSpeaking(true);
      setSpeechBlocked(false);
    };
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      setSpeechBlocked(true);
    };
    window.speechSynthesis.speak(utterance);
    window.setTimeout(() => {
      if (window.speechSynthesis.speaking) return;
      setSpeechBlocked(true);
    }, 700);
  }

  async function askDave(
    message: string,
    history: Message[],
    greeting = false
  ) {
    setError('');
    if (!greeting) setSending(true);
    else setLoading(true);
    try {
      const response = await fetch('/api/dave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
        cache: 'no-store',
      });
      const result = (await response.json()) as {
        answer?: string;
        error?: string;
      };
      if (!response.ok || !result.answer)
        throw new Error(result.error || 'Dave could not answer right now.');
      const next = [
        ...history,
        ...(!greeting ? [{ role: 'user' as const, text: message }] : []),
        { role: 'assistant' as const, text: result.answer },
      ];
      setMessages(next);
      speak(result.answer);
    } catch (cause) {
      const messageText =
        cause instanceof Error
          ? cause.message
          : 'Dave could not answer right now.';
      setError(messageText);
      if (greeting)
        setMessages([
          {
            role: 'assistant',
            text: 'Hi, I’m Dave. I’m ready when you want to ask about your dashboard.',
          },
        ]);
    } finally {
      setLoading(false);
      setSending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question || sending) return;
    setInput('');
    void askDave(question, messages);
  }

  function toggleMicrophone() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognitionConstructor =
      (window as RecognitionWindow).SpeechRecognition ||
      (window as RecognitionWindow).webkitSpeechRecognition;
    if (!recognitionConstructor) {
      setError(
        'Voice input is not available in this browser. You can type to Dave instead.'
      );
      return;
    }
    const recognition = new recognitionConstructor();
    recognition.lang = navigator.language || 'en-US';
    recognition.onresult = (event) => {
      const spoken = event.results[0]?.[0]?.transcript;
      if (spoken) setInput(spoken);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  return (
    <section
      aria-label="Dave assistant"
      className="absolute bottom-20 left-1/2 z-30 w-[min(92vw,360px)] -translate-x-1/2 sm:bottom-24"
    >
      <div className="overflow-hidden rounded-[26px] border border-accent/15 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3">
          <div
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-white shadow-sm"
            aria-hidden="true"
          >
            <Bot size={25} strokeWidth={1.8} />
            <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-fraunces text-lg font-semibold text-ink">
              Dave
            </h2>
            <p className="text-[11px] text-muted">Your dashboard robot</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const lastAssistantMessage = [...messages]
                .reverse()
                .find((message) => message.role === 'assistant');
              if (speaking) window.speechSynthesis?.cancel();
              else if (lastAssistantMessage) speak(lastAssistantMessage.text);
            }}
            className="rounded-full p-2 text-muted hover:bg-black/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={speaking ? 'Stop Dave speaking' : 'Play Dave reply'}
          >
            {speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <div
          className="max-h-56 space-y-3 overflow-y-auto px-4 py-3"
          aria-live="polite"
        >
          {loading && (
            <p className="text-sm text-muted">
              Dave is getting your dashboard ready…
            </p>
          )}
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <p
                className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-accent text-white' : 'rounded-bl-md bg-page-bg text-ink'}`}
              >
                {message.text}
              </p>
            </div>
          ))}
          {sending && <p className="text-xs text-muted">Dave is thinking…</p>}
          <div ref={bottomRef} />
        </div>

        {(error || speechBlocked) && (
          <p className="px-4 pb-2 text-xs text-muted" role="status">
            {error ||
              'Your browser blocked automatic speech. Tap the speaker to hear Dave.'}
          </p>
        )}
        <form
          onSubmit={submit}
          className="flex items-center gap-2 border-t border-black/5 p-3"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={listening ? 'Listening…' : 'Ask Dave about your day…'}
            aria-label="Ask Dave a question"
            maxLength={2000}
            className="min-w-0 flex-1 rounded-full bg-page-bg px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted/70 focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="button"
            onClick={toggleMicrophone}
            className={`rounded-full p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${listening ? 'bg-highlight text-white' : 'text-muted hover:bg-black/5 hover:text-accent'}`}
            aria-label={listening ? 'Stop voice input' : 'Speak to Dave'}
          >
            {listening ? <MicOff size={17} /> : <Mic size={17} />}
          </button>
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="rounded-full bg-accent p-2.5 text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Send message to Dave"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
