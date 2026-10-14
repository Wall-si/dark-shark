"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-16">
      <p className="font-ui text-sm tracking-[0.32em] text-blood uppercase">Signal lost</p>
      <h1 className="font-display text-7xl leading-none">HANDSHAKE FAILED</h1>
      <button
        type="button"
        onClick={reset}
        className="mt-6 bg-blood px-4 py-2 font-ui text-lg tracking-[0.18em] text-void uppercase"
      >
        Retry handshake
      </button>
    </div>
  );
}
