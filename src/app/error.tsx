"use client";
import Link from "next/link";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="marble loading-view">
      <span className="eyebrow">A PAUSE IN THE JOURNEY</span>
      <h1>Let’s try that again.</h1>
      <p>
        The preview couldn’t open this page. Your original sample data is still
        available.
      </p>
      <div className="button-row">
        <button className="button primary" onClick={reset}>
          Try again
        </button>
        <Link className="text-button" href="/">
          Return home
        </Link>
      </div>
    </main>
  );
}
