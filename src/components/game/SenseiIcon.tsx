// Minimal monochrome sensei mentor icon — Apple-style line art.
type Props = { className?: string };
export function SenseiIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Top knot / hair */}
      <path d="M10.5 4.2c.6-.7 2.4-.7 3 0" />
      <path d="M12 3.2v1.6" />
      {/* Head */}
      <path d="M7.5 10.5c0-3 2-5 4.5-5s4.5 2 4.5 5v1.2c0 1.2-.4 2.2-1 3" />
      {/* Eyes (closed, focused) */}
      <path d="M9.5 10.4c.5-.4 1.3-.4 1.8 0" />
      <path d="M12.7 10.4c.5-.4 1.3-.4 1.8 0" />
      {/* Mustache */}
      <path d="M10 12.6c.6.4 1.4.4 2 0" />
      <path d="M12 12.6c.6.4 1.4.4 2 0" />
      {/* Long beard */}
      <path d="M9 13.5c.4 2 1.4 3.5 3 4.5 1.6-1 2.6-2.5 3-4.5" />
      <path d="M10.5 17c.4.8 1 1.4 1.5 1.8.5-.4 1.1-1 1.5-1.8" />
      {/* Shoulders / robe */}
      <path d="M5 21c.8-2.2 3.2-3.5 7-3.5s6.2 1.3 7 3.5" />
    </svg>
  );
}
