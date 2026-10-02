export default function Loading() {
  return (
    <main className="marble loading-view" role="status">
      <span className="eyebrow">YOUR NEXT CHAPTER</span>
      <h1>Putting the pieces together.</h1>
      <p>Preparing your sample workspace…</p>
      <div className="loading-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </main>
  );
}
