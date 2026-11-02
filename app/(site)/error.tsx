"use client";

export default function SiteError({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">Something went wrong.</h1>
        <p className="mt-3 text-mist">Please try again in a moment.</p>
        <button type="button" onClick={reset} className="mt-6 rounded-full bg-cyan px-6 py-3 font-semibold text-abyss">Try again</button>
      </div>
    </div>
  );
}
