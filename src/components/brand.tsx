import Link from "next/link";
export default function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Keystone home">
      <svg viewBox="0 0 24 26" aria-hidden="true">
        <path
          d="M3 25V12a9 9 0 0 1 18 0v13h-5V12a4 4 0 0 0-8 0v13Z"
          fill="currentColor"
        />
        <path d="m9 1 6 0-1 7h-4Z" fill="var(--gold-400)" />
      </svg>
      <span>
        keystone<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
