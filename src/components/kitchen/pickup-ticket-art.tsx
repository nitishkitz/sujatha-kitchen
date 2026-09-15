export function PickupTicketArt({ code }: { code: string }) {
  return (
    <svg viewBox="0 0 320 300" className="w-full max-w-72" aria-hidden="true">
      <g opacity="0.35" fill="#07271c">
        <rect x="28" y="36" width="6" height="6" transform="rotate(45 31 39)" />
        <rect x="268" y="52" width="8" height="8" transform="rotate(45 272 56)" />
        <rect x="48" y="210" width="5" height="5" transform="rotate(45 50 212)" />
        <rect x="274" y="188" width="4" height="16" />
        <rect x="262" y="194" width="16" height="4" />
      </g>
      <ellipse cx="168" cy="286" rx="78" ry="10" fill="#07271c" opacity="0.16" />
      <path
        d="M70 292c-10-4-28-24-22-58 6-30 32-44 62-32 14 6 24 4 38-2 22-8 40 6 58 28 16 20 14 48-8 64-24 18-72 22-128 0z"
        fill="#07271c"
      />
      <path d="M118 214c8 28 4 48-14 68" fill="none" stroke="#041c14" strokeWidth="16" strokeLinecap="round" />
      <path d="M150 200c24-2 42 14 38 34" fill="none" stroke="#041c14" strokeWidth="14" strokeLinecap="round" />
      <g transform="translate(96 18) rotate(-12)">
        <rect x="0" y="0" width="132" height="156" rx="14" fill="#fffcf6" />
        <rect x="10" y="10" width="112" height="136" rx="8" fill="none" stroke="#004b3a" strokeWidth="1.4" />
        <text x="66" y="40" textAnchor="middle" fill="#004b3a" fontFamily="Great Vibes, cursive" fontSize="28">
          Sujatha's
        </text>
        <text
          x="66"
          y="96"
          textAnchor="middle"
          fill="#07271c"
          fontFamily="DM Sans, sans-serif"
          fontSize="42"
          fontWeight="700"
        >
          {code}
        </text>
        <text
          x="66"
          y="124"
          textAnchor="middle"
          fill="#6a6e68"
          fontFamily="DM Sans, sans-serif"
          fontSize="8"
          letterSpacing="1.8"
        >
          AUTHENTIC KITCHEN
        </text>
      </g>
    </svg>
  );
}
