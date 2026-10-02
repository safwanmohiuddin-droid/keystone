import Link from "next/link";
export default function NotFound() {
  return (
    <main className="marble loading-view">
      <span className="eyebrow">A DIFFERENT PATH</span>
      <h1>This stone hasn’t been placed.</h1>
      <p>That page isn’t part of the preview.</p>
      <Link className="button primary" href="/">
        Return to Keystone
      </Link>
    </main>
  );
}
